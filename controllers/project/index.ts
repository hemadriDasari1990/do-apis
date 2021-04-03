import { NextFunction, Request, Response } from "express";
import { boardAddFields, boardsLookup } from "../../util/boardFilters";

import Project from "../../models/project";
import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import { addProjectToDepartment } from "../department";
import { findBoardsByProjectAndDelete } from "../board";
import mongoose from "mongoose";

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.body.projectId) },
      update = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          departmentId: req.body.departmentId,
          status: req.body.status || "active",
          isPrivate: req.body.isPrivate || false,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true }; // new true will return modified document instead of original one
    const project = await getProject({
      $and: [
        { title: req.body.title },
        { departmentId: req.body.departmentId },
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
    await addProjectToDepartment(updated?._id, req.body.departmentId);
    return res.status(200).send(updated);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getProjectDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const projects = await Project.aggregate([
      { $match: query },
      {
        $sort: { _id: -1 },
      },
      {
        $skip: parseInt(req.query.offset as string),
      },
      {
        $limit: parseInt(req.query.limit as string),
      },
      boardsLookup,
      boardAddFields,
    ]);
    return res.status(200).json(projects ? projects[0] : null);
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

export async function findProjectsByDepartmentAndDelete(
  departmentId: string
): Promise<any> {
  try {
    const projectsList = await getProjectsByDepartment(departmentId);
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

async function getProjectsByDepartment(departmentId: string): Promise<any> {
  try {
    if (!departmentId) {
      return;
    }
    return await Project.find({ departmentId });
  } catch (err) {
    throw `Error while fetching projects ${err || err.message}`;
  }
}
