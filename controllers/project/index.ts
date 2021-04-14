import { NextFunction, Request, Response } from "express";
import { boardAddFields, boardsLookup } from "../../util/boardFilters";
import { getPagination, getUser } from "../../util";

import Project from "../../models/project";
import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import { addProjectToUser } from "../user";
import { findBoardsByProjectAndDelete } from "../board";
import mongoose from "mongoose";
import { userLookup } from "../../util/projectFilters";

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const user = getUser(req.headers.authorization as string);
    const query = { _id: mongoose.Types.ObjectId(req.body.projectId) },
      update = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          userId: user?._id,
          status: req.body.status || "active",
          isPrivate: req.body.isPrivate || false,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true }; // new true will return modified document instead of original one

    const project = await getProject({
      $and: [
        { title: req.body.title?.trim() },
        { description: req.body.description?.trim() },
        { userId: user?._id },
      ],
    });

    if (project) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Project with ${project?.title} already exist. Please choose different name`,
      });
    }
    const updated = await Project.findOneAndUpdate(query, update, options);
    if (!updated) {
      return next(updated);
    }
    await addProjectToUser(updated?._id, user?._id);
    return res.status(200).send(updated);
  } catch (err) {
    return res.status(500).send(err || err.message);
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
          $or: [{ title: { $regex: req.query.queryString, $options: "i" } }],
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
          boardAddFields,
          boardsLookup,
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

async function getProject(query: { [Key: string]: any }): Promise<any> {
  try {
    const project = await Project.findOne(query);
    return project;
  } catch (err) {
    throw err | err.message;
  }
}

export async function createProject(payload: {
  [Key: string]: any;
}): Promise<any> {
  try {
    if (!payload) {
      return;
    }
    const project = new Project({
      title: payload.title,
      userId: payload?.userId,
    });
    const created = await project.save();
    await addProjectToUser(created?._id, payload?.userId);
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
  try {
    await findBoardsByProjectAndDelete(req.params.id);
    const deleted = await Project.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    return res.status(200).json({ deleted: true });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function addBoardToProject(
  boardId: string,
  projectId: string
): Promise<any> {
  try {
    if (!boardId || !projectId) {
      return;
    }
    const updated = await Project.findByIdAndUpdate(
      projectId,
      { $push: { boards: boardId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding board to project ${err || err.message}`;
  }
}

export async function findProjectsByUserAndDelete(
  userId: string
): Promise<any> {
  try {
    const projectsList = await getProjectsByUser(userId);
    if (!projectsList?.length) {
      return;
    }
    const deleted = projectsList.reduce(
      async (promise: Promise<any>, project: { [Key: string]: any }) => {
        await promise;
        await findBoardsByProjectAndDelete(project?.id);
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
