import { NextFunction, Request, Response } from "express";
import {
  departmentAddFields,
  departmentsLookup,
} from "../../util/departmentFilters";

import Department from "../../models/department";
import { addDepartmentToOrganization } from "../organization";
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
      organizationId: req.body.organizationId,
      status: req.body.status || "active",
    };
    const options = { upsert: true, new: true };
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
    await addDepartmentToOrganization(updated?._id, req.body.organizationId);
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
    const organizations = await Department.aggregate([
      { $match: query },
      departmentsLookup,
      departmentAddFields,
    ]);
    return res.status(200).json(organizations ? organizations[0] : null);
  } catch (err) {
    return res.status(500).send(err || err.message);
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
