import {
  MAX_PROJECTS_COUNT,
  MAX_PROJECTS_ERROR,
  RESOURCE_ALREADY_EXISTS,
} from "../../util/constants";
import { NextFunction, Request, Response } from "express";
import {
  boardAddFields,
  boardsLookup,
  completedBoardsLookup,
  inProgressBoardsLookup,
  newBoardsLookup,
} from "../../util/boardFilters";
import { getPagination, getUser } from "../../util";

import Project from "../../models/project";
import { addProjectToUser } from "../user";
import { findBoardsByProjectAndDelete } from "../board";
import mongoose from "mongoose";
import { userLookup } from "../../util/projectFilters";

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const user = getUser(req.headers.authorization as string);
    const count = await Project.find({
      userId: user?._id,
    }).countDocuments();
    if (count >= MAX_PROJECTS_COUNT) {
      return res.status(409).json({
        errorId: MAX_PROJECTS_ERROR,
        message: `You have reached the limit of maximum projects ${MAX_PROJECTS_COUNT}. Please upgrade your plan.`,
      });
    }
    const query = { _id: mongoose.Types.ObjectId(req.body.projectId) },
      update = {
        $set: {
          name: req.body.name,
          description: req.body.description,
          userId: user?._id,
          status: req.body.status || "active",
          isPrivate: req.body.isPrivate || false,
        },
      },
      options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session: session,
      }; // new true will return modified document instead of original one

    const project = await getProject(
      {
        $and: [{ name: req.body.name?.trim() }, { userId: user?._id }],
      },
      session
    );

    if (project) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Project with ${project?.name} already exist. Please choose different name`,
      });
    }
    const updated = await Project.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    await addProjectToUser(updated?._id, user?._id, session);
    await session.commitTransaction();
    return res.status(200).send(updated);
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function getProjects(req: Request, res: Response): Promise<any> {
  try {
    const query = {
      userId: mongoose.Types.ObjectId(req.query.userId as string),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
    if (req.query.queryString?.length) {
      aggregators.push({
        $match: {
          $or: [{ name: { $regex: req.query.queryString, $options: "i" } }],
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
          userLookup,
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          inProgressBoardsLookup,
          completedBoardsLookup,
          newBoardsLookup,
          boardsLookup,
          boardAddFields,
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const projects = await Project.aggregate(aggregators);
    return res.status(200).send(projects ? projects[0] : projects);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

async function getProject(
  query: { [Key: string]: any },
  session: any
): Promise<any> {
  try {
    const project = await Project.findOne(query).session(session);
    return project;
  } catch (err) {
    throw err | err.message;
  }
}

export async function createProject(
  payload: {
    [Key: string]: any;
  },
  session: any
): Promise<any> {
  try {
    if (!payload) {
      return;
    }
    const project = new Project({
      name: payload.name,
      description: payload.description,
      userId: payload?.userId,
    });
    const created = await project.save({ session });
    await addProjectToUser(created?._id, payload?.userId, session);
    return created;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    await findBoardsByProjectAndDelete(req.params.id, session);
    const deleted = await Project.findByIdAndRemove(req.params.id).session(
      session
    );
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    await session.commitTransaction();
    return res.status(200).json({ deleted: true });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).send(err || err.message);
  } finally {
    await session.endSession();
  }
}

export async function addBoardToProject(
  boardId: string,
  projectId: string,
  session: any
): Promise<any> {
  try {
    if (!boardId || !projectId) {
      return;
    }
    const updated = await Project.findByIdAndUpdate(
      projectId,
      { $push: { boards: boardId } },
      { new: true, useFindAndModify: false, session: session }
    );
    return updated;
  } catch (err) {
    throw `Error while adding board to project ${err || err.message}`;
  }
}

export async function findProjectsByUserAndDelete(
  userId: string,
  session: any
): Promise<any> {
  try {
    const projectsList = await getProjectsByUser(userId);
    if (!projectsList?.length) {
      return;
    }
    const deleted = projectsList.reduce(
      async (promise: Promise<any>, project: { [Key: string]: any }) => {
        await promise;
        await findBoardsByProjectAndDelete(project?.id, session);
        // await findSectionsByBoardAndDelete(board._id)
        // await deleteNoteById(board._id);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}

export async function getProjectsByUser(userId: string): Promise<any> {
  try {
    if (!userId) {
      return;
    }
    return await Project.find({ userId });
  } catch (err) {
    throw `Error while fetching projects ${err || err.message}`;
  }
}
