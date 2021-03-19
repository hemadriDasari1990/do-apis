import { NextFunction, Request, Response } from "express";
import { projectAddFields, projectsLookup } from "../../util/projectFilters";

import Department from "../../models/department";
import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
import { addDepartmentToUser } from "../user";
import { findProjectsByDepartmentAndDelete } from "../project";
import mongoose from "mongoose";

export async function updateDepartment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const update = {
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
      status: req.body.status || "active",
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const department = await getDepartment({
      $and: [{ title: req.body.title }, { userId: req.body.userId }],
    });
    if (department) {
      return res.status(409).json({
        errorId: RESOURCE_ALREADY_EXISTS,
        message: `Department with ${department?.title} already exist. Please choose different name`,
      });
    }
    const updated: any = await Department.findByIdAndUpdate(
      req.body.departmentId
        ? req.body.departmentId
        : new mongoose.Types.ObjectId(),
      update,
      options
    );
    if (!updated) {
      return next(updated);
    }
    await addDepartmentToUser(updated?._id, req.body.userId);
    return res.status(200).send(updated);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getDepartmentDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const departments = await Department.aggregate([
      { $match: query },
      projectsLookup,
      projectAddFields,
    ]);
    return res.status(200).json(departments ? departments[0] : null);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

async function getDepartment(query: { [Key: string]: any }): Promise<any> {
  try {
    const department = await Department.findOne(query);
    return department;
  } catch (err) {
    throw err | err.message;
  }
}

export async function deleteDepartment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    await findProjectsByDepartmentAndDelete(req.params.id);
    const deleted = await Department.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource` });
      return next(deleted);
    }
    return res.status(200).json({ deleted: true });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function addProjectToDepartment(
  projectId: string,
  departmentId: string
): Promise<any> {
  try {
    if (!projectId || !departmentId) {
      return;
    }
    const updated = await Department.findByIdAndUpdate(
      departmentId,
      { $push: { projects: projectId } },
      { new: true, useFindAndModify: false }
    );
    return updated;
  } catch (err) {
    throw `Error while adding project to department ${err || err.message}`;
  }
}
