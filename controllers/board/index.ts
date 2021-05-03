import {
  INTERNAL_SERVER_ERROR,
  MAX_BOARDS_COUNT,
  MAX_BOARDS_ERROR,
  MAX_PROJECTS_COUNT,
  MAX_PROJECTS_ERROR,
  RESOURCE_ALREADY_EXISTS,
  SECTION_COUNT_EXCEEDS,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import {
  activeTeamsLookup,
  inActiveTeamsLookup,
  teamAddFields,
  teamsLookup,
} from "../../util/teamFilters";
import { addBoardToProject, createProject } from "../project";
import { createMember, sendInviteToMember } from "../member";
import { getPagination, getUser } from "../../util";
import { sectionAddFields, sectionsLookup } from "../../util/sectionFilters";

import Board from "../../models/board";
import Project from "../../models/project";
import XLSX from "xlsx";
import { addMemberToUser } from "../user";
import { createActivity } from "../activity";
import { createInvitedTeams } from "../invite";
import { defaultSections } from "../../util/constants";
import { findSectionsByBoardAndDelete } from "../section";
import fs from "fs";
import mongoose from "mongoose";
import { projectLookup } from "../../util/projectFilters";
import { saveSection } from "../section";
import { sendInvitation } from "../team";

export async function addSectionToBoard(
  sectionId: string,
  boardId: string
): Promise<any> {
  try {
    if (!boardId || !sectionId) {
      return;
    }
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $push: { sections: sectionId } },
      { new: true, useFindAndModify: false }
    );
    return board;
  } catch (err) {
    throw "Cannot add section to Board";
  }
}

export async function checkIfNewBoardExists(projectId: string): Promise<any> {
  try {
    if (!projectId) {
      return;
    }
    const board = await getBoard({
      $and: [
        { $or: [{ status: "new" }, { status: "inprogress" }] },
        { projectId: projectId },
      ],
    });
    return board;
  } catch (err) {
    throw "Cannot get board details";
  }
}

export async function updateBoard(req: Request, res: Response): Promise<any> {
  try {
    if (!req.body.isDefaultBoard && req.body.noOfSections > 10) {
      return res.status(500).json({
        errorId: SECTION_COUNT_EXCEEDS,
        message: `Max no of sections allowed are only 10`,
      });
    }

    const user = getUser(req.headers.authorization as string);

    /* Check if user has reached projects limit on user level */
    if (!req.body.projectId) {
      const count = await Project.find({
        userId: user?._id,
      }).count();
      if (count >= MAX_PROJECTS_COUNT) {
        return res.status(409).json({
          errorId: MAX_PROJECTS_ERROR,
          message: `You have reached the limit of maximum projects ${MAX_PROJECTS_COUNT}. Please upgrade your plan.`,
        });
      }
    }

    /* Check if user has reached boards limit on project level */
    if (req.body.projectId) {
      const count = await Board.find({
        projectId: req.body.projectId,
      }).count();
      if (count >= MAX_BOARDS_COUNT) {
        return res.status(409).json({
          errorId: MAX_BOARDS_ERROR,
          message: `You have reached the limit of maximum boards ${MAX_BOARDS_COUNT}. Please upgrade your plan.`,
        });
      }
    }

    const boardDetails = await getBoard({
      $and: [
        { name: req.body.name?.trim() },
        { description: req.body.description?.trim() },
        { projectId: mongoose.Types.ObjectId(req.body.projectId) },
      ],
    });
    if (boardDetails) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Board with ${boardDetails?.name} already exist. Please contact administrator`,
      });
    }

    /* Check if board exists with status new when creating a new board */
    if (!req.body.boardId) {
      const boardExists = await checkIfNewBoardExists(req.body.projectId);
      if (boardExists?._id) {
        return res.status(409).json({
          errorId: RESOURCE_ALREADY_EXISTS,
          message: `You can't create another board when your previous ${boardExists?.name} is in ${boardExists?.status} state.`,
        });
      }
    }

    const boardsCount: number = await Board.find({
      projectId: req.body.projectId,
    }).count();

    const query = mongoose.Types.ObjectId.isValid(req.body.boardId)
        ? { _id: mongoose.Types.ObjectId(req.body.boardId) }
        : { _id: { $exists: false } }, // Create new record if id is not matching
      update = {
        $set: {
          ...(!req.body.boardId ? { name: "Board " + (boardsCount + 1) } : {}),
          description: req.body.description,
          projectId: req.body.projectId,
          status: req.body.status,
          sprint: boardsCount + 1,
          isDefaultBoard: req.body.isDefaultBoard,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updated: any = await Board.findOneAndUpdate(query, update, options);
    if (!updated) {
      return res.status(409).json({
        errorId: INTERNAL_SERVER_ERROR,
        message: `Error while creating the board`,
      });
    }
    if (!req.body.isDefaultBoard && req.body.noOfSections) {
      await Array(parseInt(req.body.noOfSections))
        .fill(0)
        .reduce(async (promise) => {
          await promise;
          const section = await saveSection({
            boardId: updated._id,
            name: "Section Title",
          });
          await addSectionToBoard(section?._id, updated._id);
        }, Promise.resolve());
    }
    if (
      req.body.isDefaultBoard &&
      !req.body.noOfSections &&
      defaultSections?.length
    ) {
      await defaultSections.reduce(async (promise, defaultSectionTitle) => {
        await promise;
        const section = await saveSection({
          boardId: updated._id,
          name: defaultSectionTitle,
        });
        await addSectionToBoard(section?._id, updated._id);
      }, Promise.resolve());
    }
    if (req.body.teams?.length && updated?._id) {
      await addTeamsToBoad(req.body.teams, updated);
      await createInvitedTeams(req.body.teams, updated?._id);
    }
    /* Add existing project to board */
    if (req.body.projectId) {
      await addBoardToProject(updated?._id, req.body.projectId);
    }

    /* Create new project and map board to project */
    if (!req.body.projectId && req.body.projectTitle && user) {
      const newProject = await createProject({
        name: req.body.projectTitle,
        description: req.body.projectDescription,
        userId: user?._id,
      });
      await Board.findByIdAndUpdate(updated._id, {
        projectId: newProject?._id,
      });
      await addBoardToProject(updated?._id, newProject?._id);
    }
    await sendInvitation(req.body.teams, user, updated?._id);
    await createActivity({
      userId: user?._id,
      boardId: updated?._id,
      title: `${updated?.name}`,
      primaryAction: "board",
      type: "board",
      action: req.body.boardId ? "update" : "create",
    });
    const board = await getBoardDetailsLocal(updated?._id);
    return res.status(200).send(board);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function startOrCompleteBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(payload.id) },
      update =
        payload.action === "start"
          ? {
              $set: {
                startedAt: payload.startedAt,
                status: "inprogress",
              },
            }
          : {
              $set: {
                completedAt: payload.completedAt,
                status: "completed",
                isLocked: true,
              },
            };
    const options = { new: true }; // return updated document
    const updated: any = await Board.findOneAndUpdate(query, update, options);
    if (!updated) {
      return updated;
    }
    await createActivity({
      userId: payload?.user?._id,
      boardId: payload.id,
      title: "the session",
      type: "board",
      action: payload.action === "start" ? "session-start" : "session-stop",
    });
    const board = await getBoardDetailsLocal(updated?._id);
    return board;
  } catch (err) {
    return err || err.message;
  }
}

export async function getBoardDetailsLocal(boardId: string): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(boardId) };
    const boards = await Board.aggregate([
      { $match: query },
      projectLookup,
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      teamsLookup,
      inActiveTeamsLookup,
      activeTeamsLookup,
      teamAddFields,
      sectionsLookup,
      sectionAddFields,
    ]);
    return boards ? boards[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getBoardDetailsWithProject(
  boardId: string
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(boardId) };
    const boards = await Board.aggregate([
      { $match: query },
      projectLookup,
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return boards ? boards[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getBoardDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = getUser(req.headers.authorization as string);
    const board = await getBoardDetailsLocal(req.params.id);
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const increment = { $inc: { views: 1 } };
    await createActivity({
      userId: user?._id,
      boardId: board?._id,
      title: `${board?.name}`,
      type: "board",
      action: "view",
    });
    await Board.findOneAndUpdate(query, increment);
    return res.status(200).send(board);
  } catch (err) {
    throw err || err.message;
  }
}

export async function getBoards(req: Request, res: Response): Promise<any> {
  try {
    const query = {
      projectId: mongoose.Types.ObjectId(req.query.projectId as string),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
    if (req.query.queryString?.length) {
      aggregators.push({
        $match: {
          $or: [
            { name: { $regex: req.query.queryString, $options: "i" } },
            { sprint: { $regex: req.query.queryString, $options: "i" } },
          ],
        },
      });
    }
    aggregators.push({
      $facet: {
        data: [
          { $match: query },
          { $sort: { _id: -1 } },
          { $skip: offset },
          { $limit: limit },
          teamsLookup,
          inActiveTeamsLookup,
          activeTeamsLookup,
          teamAddFields,
          sectionsLookup,
          sectionAddFields,
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const boards = await Board.aggregate(aggregators);
    return res.status(200).send(boards ? boards[0] : boards);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function deleteBoard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const deleted = await Board.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    return res.status(200).json({
      deleted: true,
      message: "Resource has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getBoard(query: { [Key: string]: any }): Promise<any> {
  try {
    const board = await Board.findOne(query).populate([
      {
        path: "projectId",
        model: "Project",
      },
    ]);
    return board;
  } catch (err) {
    throw err | err.message;
  }
}

export async function findBoardsByProjectAndDelete(
  projectId: string
): Promise<any> {
  try {
    const boardsList = await getBoardsByProject(projectId);
    if (!boardsList?.length) {
      return;
    }
    const deleted = boardsList.reduce(
      async (promise: Promise<any>, board: { [Key: string]: any }) => {
        await promise;
        await findSectionsByBoardAndDelete(board._id);
        // await deleteNoteById(board._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

// async function deleteNoteById(noteId: string):Promise<any> {
//   try {
//     if(!noteId){
//       return;
//     }
//     return await Note.findByIdAndRemove(noteId);
//   } catch(err) {
//     throw `Error while deleting note ${err || err.message}`;
//   }
// }

async function getBoardsByProject(projectId: string): Promise<any> {
  try {
    if (!projectId) {
      return;
    }
    return await Board.find({ projectId });
  } catch (err) {
    throw `Error while fetching boards ${err || err.message}`;
  }
}

export async function addTeamsToBoad(
  teams: Array<string>,
  board: { [Key: string]: any }
): Promise<any> {
  try {
    if (!teams || !Array.isArray(teams) || !teams?.length || !board?._id) {
      return;
    }
    await teams.reduce(async (promise, team: string) => {
      await promise;
      if (!board?.teams?.includes(team)) {
        await Board.findByIdAndUpdate(
          board?._id,
          { $push: { teams: team } },
          { new: true, useFindAndModify: false }
        );
      }
    }, Promise.resolve());
  } catch (err) {
    throw `Error while adding team to board ${err || err.message}`;
  }
}

export async function changeVisibility(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    if (!payload || !payload?.id) {
      return;
    }
    const updated: any = await Board.findByIdAndUpdate(
      payload?.id,
      { $set: { isPrivate: payload?.isPrivate } },
      { new: true, useFindAndModify: false }
    );
    await createActivity({
      userId: payload?.user?._id,
      boardId: updated?._id,
      title: `${updated?.name}`,
      primaryAction: "visibility to",
      primaryTitle: payload?.isPrivate ? "private" : "public",
      type: "visibility",
      action: payload?.isPrivate ? "private" : "public",
    });
    return updated;
  } catch (err) {
    return `Error while updating board visibility ${err || err.message}`;
  }
}

export async function inviteMemberToBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    if (!payload || !payload?.id || !payload.user || !payload.member) {
      return;
    }

    if (payload?.createMember) {
      const created = await createMember({
        email: payload?.member?.email,
        name: payload?.member?.name,
        userId: payload?.user?._id,
      });
      await addMemberToUser(created?._id, payload?.user?._id);
    }

    const board: any = await Board.findById(payload?.id);
    const sent = await sendInviteToMember(
      board,
      payload?.user,
      payload?.member
    );
    return sent;
  } catch (err) {
    return `Error while sending inviting ${err || err.message}`;
  }
}

export async function downloadBoardReport(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const data: any = await getBoardDetailsLocal(req.params.id);

    if (data && data?.sections?.length) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data?.sections);
      XLSX.utils.book_append_sheet(wb, ws, "report");
      XLSX.writeFile(wb, `${data?.name}.xlsx`, {
        bookType: "xlsx",
        type: "binary",
      });
      const stream = fs.createReadStream(`${data?.name}.xlsx`);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${data?.name}.xlsx`
      );
      stream.pipe(res);
    } else {
      throw new Error("No data found on this board");
    }
  } catch (err) {
    throw new Error("Error while generating the report");
  }
}
