import { NextFunction, Request, Response } from "express";
import { sectionAddFields, sectionsLookup } from "../../util/sectionFilters";

import Board from "../../models/board";
import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import { addBoardToProject } from "../project";
import { findSectionsByBoardAndDelete } from "../section";
import mongoose from "mongoose";
import { saveSection } from "../section";

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

export async function updateBoard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.body.boardId) },
      update = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          sprint: req.body.sprint,
          projectId: req.body.projectId,
          status: req.body.status || "draft",
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const boardDetails = await getBoard({
      $and: [{ title: req.body.title }, { projectId: req.body.projectId }],
    });
    if (boardDetails) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Board with ${boardDetails?.title} already exist. Please choose different name`,
      });
    }
    const updated: any = await Board.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    if (updated?.status !== "draft") {
      await Array(parseInt(req.body.noOfSections))
        .fill(0)
        .reduce(async (promise) => {
          await promise;
          const section = await saveSection({
            boardId: updated._id,
            title: "Section Title",
          });
          await addSectionToBoard(section?._id, updated._id);
        }, Promise.resolve());
      await addBoardToProject(updated?._id, req.body.projectId);
      await addTeamsToBoad(req.body.teams, updated?._id);
    }
    const board = await getBoardDetailsLocal(updated?._id);
    return res.status(200).send(board);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function startOrCompleteBoard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.body.id) },
      update =
        req.params.action === "start"
          ? {
              $set: {
                startedAt: req.body.startedAt,
                status: "inprogress",
              },
            }
          : {
              $set: {
                completedAt: req.body.completedAt,
                status: "completed",
                isLocked: true,
              },
            };
    const updated = await Board.findOneAndUpdate(query, update);
    if (!updated) {
      return next(updated);
    }
    const board = await getBoardDetailsLocal(updated?._id);
    return res.status(200).send(board);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getBoardDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const board = await getBoardDetailsLocal(req.params.id);
    return res.status(200).send(board);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

async function getBoardDetailsLocal(boardId: string): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(boardId) };
    const boards = await Board.aggregate([
      { $match: query },
      sectionsLookup,
      sectionAddFields,
    ]);
    return boards ? boards[0] : null;
  } catch (err) {
    throw err || err.message;
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
    return res
      .status(200)
      .json({ message: "Resource has been deleted successfully" });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

async function getBoard(query: { [Key: string]: any }): Promise<any> {
  try {
    const board = await Board.findOne(query);
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
        console.log(board);
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
  boardId: string
): Promise<any> {
  try {
    if (!teams || !Array.isArray(teams) || !teams?.length || !boardId) {
      return;
    }
    await teams.reduce(async (promise, team: string) => {
      await promise;
      await Board.findByIdAndUpdate(
        boardId,
        { $push: { teams: team } },
        { new: true, useFindAndModify: false }
      );
    }, Promise.resolve());
  } catch (err) {
    throw `Error while adding team to board ${err || err.message}`;
  }
}
