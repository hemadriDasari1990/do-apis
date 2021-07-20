import {
  INTERNAL_SERVER_ERROR,
  MAX_BOARDS_COUNT,
  MAX_BOARDS_ERROR,
  MAX_PROJECTS_COUNT,
  MAX_PROJECTS_ERROR,
  MAX_SECTIONS_COUNT,
  MAX_SECTIONS_ERROR,
  RESOURCE_ALREADY_EXISTS,
} from "../../util/constants";
import { Request, Response } from "express";
import {
  activeTeamsLookup,
  inActiveTeamsLookup,
  teamAddFields,
  teamsLookup,
} from "../../util/teamFilters";
import { addBoardToProject, createProject } from "../project";
import { createActivity, findActivitiesByBoardAndDelete } from "../activity";
import {
  createInvitedTeams,
  findInvitedMembersByBoardAndDelete,
  updateInvitedMember,
} from "../invite";
import { getPagination, getUser } from "../../util";
import { sectionAddFields, sectionsLookup } from "../../util/sectionFilters";

import Board from "../../models/board";
import JoinMember from "../../models/join";
import Project from "../../models/project";
import User from "../../models/user";
import XLSX from "xlsx";
import { findJoinedMembersByBoardAndDelete } from "../join";
import { findSectionsByBoardAndDelete } from "../section";
import fs from "fs";
import { getMember } from "../member";
import { joinedMembersLookup } from "../../util/boardFilters";
import mongoose from "mongoose";
import { projectLookup } from "../../util/projectFilters";
import { saveSection } from "../section";

export async function addSectionToBoard(
  sectionId: string,
  boardId: string,
  session: any
): Promise<any> {
  try {
    if (!boardId || !sectionId || !session) {
      return;
    }
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $push: { sections: sectionId } },
      { new: true, useFindAndModify: false, session: session }
    );
    return board;
  } catch (err) {
    throw "Cannot add section to Board";
  }
}

export async function checkIfNewBoardExists(
  projectId: string,
  session: any
): Promise<any> {
  try {
    if (!projectId || !session) {
      return;
    }
    const board = await getBoard(
      {
        $and: [
          { $or: [{ status: "new" }, { status: "inprogress" }] },
          { projectId: projectId },
        ],
      },
      session
    );
    return board;
  } catch (err) {
    throw "Cannot get board details";
  }
}

export async function updateBoard(req: Request, res: Response): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (
      !req.body.defaultSection?.length &&
      parseInt(req.body.noOfSections) > MAX_SECTIONS_COUNT
    ) {
      return res.status(500).json({
        errorId: MAX_SECTIONS_ERROR,
        message: `Max no of sections allowed are only 10`,
      });
    }

    const user = getUser(req.headers.authorization as string);
    let projectCount = 0;
    /* Check if user has reached projects limit on user level */
    if (!req.body.projectId) {
      projectCount = await Project.find({
        userId: user?._id,
      }).countDocuments();
      if (projectCount >= MAX_PROJECTS_COUNT) {
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
      }).countDocuments();
      if (count >= MAX_BOARDS_COUNT) {
        return res.status(409).json({
          errorId: MAX_BOARDS_ERROR,
          message: `You have reached the limit of maximum boards ${MAX_BOARDS_COUNT}. Please upgrade your plan.`,
        });
      }
    }

    const boardDetails = await getBoard(
      {
        $and: [
          { name: req.body.name?.trim() },
          { description: req.body.description?.trim() },
          { projectId: mongoose.Types.ObjectId(req.body.projectId) },
        ],
      },
      session
    );
    if (boardDetails) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Board with ${boardDetails?.name} already exist. Please choose different name`,
      });
    }

    /* Check if board exists with status new when creating a new board */
    if (!req.body.boardId) {
      const boardExists = await checkIfNewBoardExists(
        req.body.projectId,
        session
      );
      if (boardExists?._id) {
        return res.status(409).json({
          errorId: RESOURCE_ALREADY_EXISTS,
          message: `You can't create another board when your previous ${boardExists?.name} is in ${boardExists?.status} state.`,
        });
      }
    }

    const boardsCount: number = await Board.find({
      projectId: req.body.projectId,
    }).countDocuments();

    const query = mongoose.Types.ObjectId.isValid(req.body.boardId)
        ? { _id: mongoose.Types.ObjectId(req.body.boardId) }
        : { _id: { $exists: false } }, // Create new record if id is not matching
      update = {
        $set: {
          ...(!req.body.boardId ? { name: req.body?.name?.trim() } : {}),
          description: req.body?.description,
          projectId: req.body?.projectId,
          status: req.body?.status,
          sprint: boardsCount + 1,
          defaultSection: req.body?.defaultSection,
          isAnonymous: req.body?.isAnonymous,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const updated: any = await Board.findOneAndUpdate(query, update, options);
    if (!updated) {
      return res.status(409).json({
        errorId: INTERNAL_SERVER_ERROR,
        message: `Error while creating the board`,
      });
    }
    if (!req.body.defaultSection && req.body.noOfSections) {
      await Array(parseInt(req.body.noOfSections))
        .fill(0)
        .reduce(async (promise, index: number) => {
          await promise;
          const section = await saveSection(
            {
              boardId: updated._id,
              name: "Section Title",
              position: index,
            },
            session
          );
          await addSectionToBoard(section?._id, updated._id, session);
        }, Promise.resolve());
    }
    if (
      req.body.defaultSection &&
      !req.body.noOfSections &&
      req.body.defaultSection?.length
    ) {
      await req.body.defaultSection
        ?.split(",")
        .reduce(
          async (promise: any, defaultSectionTitle: string, index: number) => {
            await promise;
            const section = await saveSection(
              {
                boardId: updated._id,
                name: defaultSectionTitle,
                position: index,
              },
              session
            );
            await addSectionToBoard(section?._id, updated._id, session);
          },
          Promise.resolve()
        );
    }
    /* Add existing project to board */
    if (req.body.projectId) {
      await addBoardToProject(updated?._id, req.body.projectId, session);
    }

    /* Create new project and map board to project */
    if (!req.body.projectId && req.body.projectTitle && user) {
      const newProject = await createProject(
        {
          name: req.body.projectTitle,
          description: req.body.projectDescription,
          userId: user?._id,
        },
        session
      );
      await Board.findByIdAndUpdate(
        updated._id,
        {
          projectId: newProject?._id,
        },
        { session: session }
      );
      await addBoardToProject(updated?._id, newProject?._id, session);
      if (!projectCount) {
        await User.findByIdAndUpdate(
          user?._id,
          { $set: { isStarted: true } },
          { session: session }
        );
      }
    }
    if (!req.body.isAnonymous && req.body.teams?.length && updated?._id) {
      await addTeamsToBoard(req.body.teams, updated, session);
      await createInvitedTeams(req.body.teams, updated?._id, user, session);
    }
    const board = await getBoardDetailsWithMembers(updated?._id, session);
    await session.commitTransaction();
    return res.status(200).send(board);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function startOrCompleteBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (!payload.id) {
      return;
    }
    let joinedMember: any;
    const member = await getMember(
      {
        _id: mongoose.Types.ObjectId(payload.memberId),
      },
      session
    );
    const query = { _id: mongoose.Types.ObjectId(payload.id) },
      update =
        payload.action === "start"
          ? {
              $set: {
                startedAt: Date.now(),
                status: "inprogress",
              },
            }
          : payload.action === "end"
          ? {
              $set: {
                completedAt: Date.now(),
                status: "completed",
                isLocked: true,
              },
            }
          : {
              $set: {
                completedAt: null,
                status: "inprogress",
                isLocked: false,
              },
            };
    const options = { new: true, session: session }; // return updated document
    const updated: any = await Board.findOneAndUpdate(query, update, options);
    if (!updated) {
      return updated;
    }

    /* Add member to the board who is starting the session */
    if (payload.action === "start" && !updated?.isInstant) {
      const join = new JoinMember({
        boardId: payload.id,
        email: member?.email,
        name: member?.name,
        avatarId: member?.avatarId,
      });
      joinedMember = await join.save({ session });
      await addJoinedMemberToBoard(joinedMember?._id, payload.id, session);
    }

    await createActivity(
      {
        memberId: updated?.isInstant
          ? payload?.joinedMemberId
          : joinedMember?._id,
        boardId: payload.id,
        message:
          payload.action === "start"
            ? " <u>started</u> the session"
            : payload.action === "end"
            ? " <u>ended</u> the session"
            : " <u>resumed</u> the session",
        type: "board",
      },
      session
    );
    const board = await getBoardDetailsWithMembers(updated?._id, session);
    await session.commitTransaction();
    board.joinedMemberId = joinedMember?._id;
    return board;
  } catch (err) {
    console.log("error", err);
    await session.abortTransaction();
    return err || err.message;
  } finally {
    await session.endSession();
  }
}

export async function createInstantBord(
  req: Request,
  res: Response
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (
      !req.body.defaultSection?.length &&
      parseInt(req.body.noOfSections) > MAX_SECTIONS_COUNT
    ) {
      return res.status(500).json({
        errorId: MAX_SECTIONS_ERROR,
        message: `Max no of sections allowed are only 10`,
      });
    }
    const query = { _id: { $exists: false } }, // Create new record if id is not matching
      update = {
        $set: {
          name: req.body?.name,
          description: req.body?.description,
          status: "new",
          sprint: 1,
          defaultSection: req.body?.defaultSection,
          isInstant: true,
          isAnonymous: req.body?.isAnonymous,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      };
    const updated: any = await Board.findOneAndUpdate(query, update, options);
    if (!req.body?.defaultSection && req.body?.noOfSections) {
      await Array(parseInt(req.body?.noOfSections))
        .fill(0)
        .reduce(async (promise, index: number) => {
          await promise;
          const section = await saveSection(
            {
              boardId: updated._id,
              name: "Section Title",
              position: index,
            },
            session
          );
          await addSectionToBoard(section?._id, updated._id, session);
        }, Promise.resolve());
    }
    if (
      req.body.defaultSection &&
      !req.body.noOfSections &&
      req.body.defaultSection?.length
    ) {
      await req.body.defaultSection
        ?.split(",")
        .reduce(
          async (promise: any, defaultSectionTitle: string, index: number) => {
            await promise;
            const section = await saveSection(
              {
                boardId: updated._id,
                name: defaultSectionTitle,
                position: index,
              },
              session
            );
            await addSectionToBoard(section?._id, updated._id, session);
          },
          Promise.resolve()
        );
    }
    await session.commitTransaction();
    return res.status(200).send(updated);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function getBoardDetailsForReport(boardId: string): Promise<any> {
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

export async function getBoardDetailsWithMembers(
  boardId: string,
  session: any
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(boardId) };
    const boards = await Board.aggregate([
      { $match: query },
      teamsLookup,
      teamAddFields,
      sectionsLookup,
      sectionAddFields,
      projectLookup,
      joinedMembersLookup,
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          completedAt: 1,
          createdAt: 1,
          description: 1,
          inviteCount: 1,
          inviteSent: 1,
          isAnonymous: 1,
          defaultSection: 1,
          isLocked: 1,
          isPrivate: 1,
          name: 1,
          projectId: 1,
          sprint: 1,
          status: 1,
          startedAt: 1,
          teams: 1,
          totalSections: 1,
          totalNotes: 1,
          updatedAt: 1,
          totalTeams: 1,
          views: 1,
          _id: 1,
          project: 1,
          isInstant: 1,
          joinedMembers: 1,
          enableReactions: 1,
        },
      },
    ]).session(session);
    return boards ? boards[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getBoardDetailsWithProject(
  boardId: string,
  session: any
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
    ]).session(session);
    return boards ? boards[0] : null;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getBoardDetails(
  req: Request,
  res: Response
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const user: any = getUser(req.headers.authorization as string);
    const joinedMember: any = user?.email
      ? await JoinMember.findOne({
          boardId: mongoose.Types.ObjectId(req.params.id),
          email: user?.email,
        }).session(session)
      : null;

    const board = await getBoardDetailsWithMembers(req.params.id, session);
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const increment = { $inc: { views: 1 } };
    await Board.findOneAndUpdate(query, increment, { session: session });
    await session.commitTransaction();
    board.joinedMemberId = joinedMember?._id;
    return res.status(200).send(board);
  } catch (err) {
    await session.abortTransaction();
    throw err || err.message;
  } finally {
    await session.endSession();
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
          joinedMembersLookup,
          teamsLookup,
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

export async function deleteBoard(req: Request, res: Response): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const deleted = await deleteBoardLocal(req.params.id, session);
    if (!deleted) {
      return res.status(500).json({ message: `Cannot delete resource` });
    }
    await session.commitTransaction();
    return res.status(200).json({
      deleted: true,
      message: "Resource has been deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function deleteBoardLocal(
  boardId: string,
  session: any
): Promise<any> {
  try {
    await findSectionsByBoardAndDelete(boardId, session);
    await findInvitedMembersByBoardAndDelete(boardId, session);
    await findJoinedMembersByBoardAndDelete(boardId, session);
    await findActivitiesByBoardAndDelete(boardId, session);
    const deleted = await Board.findByIdAndRemove(boardId).session(session);
    return deleted;
  } catch (err) {
    throw err | err.message;
  }
}

export async function getBoard(
  query: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    const board = await Board.findOne(query)
      .populate([
        {
          path: "projectId",
          model: "Project",
        },
      ])
      .session(session);
    return board;
  } catch (err) {
    throw err | err.message;
  }
}

export async function findBoardsByProjectAndDelete(
  projectId: string,
  session: any
): Promise<any> {
  try {
    const boardsList = await getBoardsByProject(projectId, session);
    if (!boardsList?.length) {
      return;
    }
    const deleted = boardsList.reduce(
      async (promise: Promise<any>, board: { [Key: string]: any }) => {
        await promise;
        await deleteBoardLocal(board._id, session);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function enableReactions(
  boardId: string,
  enableReactions: boolean
): Promise<any> {
  try {
    const boardUpdated = await Board.findByIdAndUpdate(boardId, {
      enableReactions,
    });
    return boardUpdated;
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

async function getBoardsByProject(
  projectId: string,
  session: any
): Promise<any> {
  try {
    if (!projectId || !session) {
      return;
    }
    return await Board.find({
      projectId: mongoose.Types.ObjectId(projectId),
    }).session(session);
  } catch (err) {
    throw `Error while fetching boards ${err || err.message}`;
  }
}

export async function addTeamsToBoard(
  teams: Array<string>,
  board: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    if (
      !teams ||
      !Array.isArray(teams) ||
      !teams?.length ||
      !board?._id ||
      !session
    ) {
      return;
    }
    await teams.reduce(async (promise, team: string) => {
      await promise;
      if (!board?.teams?.includes(team)) {
        await Board.findByIdAndUpdate(
          board?._id,
          { $push: { teams: team } },
          { new: true, useFindAndModify: false, session: session }
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
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    if (!payload || !payload?.id) {
      return;
    }
    const updated: any = await Board.findByIdAndUpdate(
      payload?.id,
      { $set: { isPrivate: payload?.isPrivate } },
      { new: true, useFindAndModify: false, session: session }
    );
    await session.commitTransaction();
    return updated;
  } catch (err) {
    await session.abortTransaction();
    return `Error while updating board visibility ${err || err.message}`;
  } finally {
    await session.endSession();
  }
}

export async function inviteMemberToBoard(payload: {
  [Key: string]: any;
}): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    let sent = null;
    if (!payload || !payload?.id || !payload.user) {
      return {
        error: true,
        message: "Invalid request",
      };
    }
    if (!payload?.email?.trim() && !payload?.teams?.length) {
      return {
        error: true,
        message: "Email address or team is required",
      };
    }
    if (payload?.user?.email?.trim() === payload?.email?.trim()) {
      return {
        error: true,
        message:
          "You are the organisor of this board. You can't invite yourself.",
      };
    }
    const board: any = await Board.findById(payload?.id);
    if (!board?._id) {
      return {
        error: true,
        message: "Board can't be found",
      };
    }
    /* Invite team if team selected */
    if (payload?.teams?.length) {
      const teamIds: any = payload?.teams?.map(
        (team: { [Key: string]: any }) => team?._id
      );

      await addTeamsToBoard(teamIds, board, session);
      await createInvitedTeams(teamIds, board?._id, payload.user, session);
      sent = {
        error: false,
      };
    }
    if (payload?.email) {
      sent = await updateInvitedMember(
        board?._id,
        payload.user,
        {
          email: payload?.email,
          name: payload?.email,
          avatarId: 0,
        },
        session
      );
    }
    await session.commitTransaction();
    return sent;
  } catch (err) {
    await session.abortTransaction();
    return {
      error: true,
      message: err?.message,
    };
  } finally {
    await session.endSession();
  }
}

export async function downloadBoardReport(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const data: any = await getBoardDetailsForReport(req.params.id);
    await downloadReport(res, data);
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function addJoinedMemberToBoard(
  joinedMemberId: string,
  boardId: string,
  session: any
): Promise<any> {
  try {
    if (!boardId || !joinedMemberId || !session) {
      return;
    }
    const board = await Board.findByIdAndUpdate(
      boardId,
      { $push: { joinedMembers: joinedMemberId } },
      { new: true, useFindAndModify: false, session: session }
    );
    return board;
  } catch (err) {
    throw "Cannot join member to board";
  }
}

export async function downloadInstantBoardReport(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const data: any = await getBoardDetailsForReport(req.params.id);
    if (!data?.isInstant) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    await downloadReport(res, data);
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
}

export async function downloadReport(
  res: Response,
  data: { [Key: string]: any }
): Promise<any> {
  try {
    if (!data) {
      return;
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      {
        "Board Name": data?.name,
        "Project Name": data?.project?.name,
        "No of Sections": data?.totalSections,
        Visibility: data?.isPrivate ? "Private" : "Public",
        "Invited Members": "",
        "Joined Members": "",
        "Session Started On": data?.startedAt || "",
        "Session Completed On": data?.completedAt || "",
        "Invite Sent": data?.inviteSent ? "yes" : "No",
        "Invite Count": data?.inviteCount,
        "Total Views": data?.views,
      },
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Information");
    if (data && data?.sections?.length) {
      data?.sections.forEach((section: { [Key: string]: any }) => {
        const notes = section?.notes?.map((note: { [Key: string]: any }) => {
          return {
            Note: note.description,
            Agree: note.totalAgree,
            DisAgree: note.totalDisagree,
            Love: note.totalLove,
            Highlight: note.totalHighlight,
            Deserve: note.totalDeserve,
            "Total Reactions": note.totalReactions,
            "Created By": note?.createdBy?.name || "Team Member",
            "Updated By": note?.updatedBy?.name || "Team Member",
            "Created At": note?.createdAt,
          };
        });
        const ws = XLSX.utils.json_to_sheet(notes);
        XLSX.utils.book_append_sheet(wb, ws, `${section?.name}`);
      });

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
