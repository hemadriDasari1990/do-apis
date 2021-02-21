import { NextFunction, Request, Response } from "express";
import {
  departmentsLookup,
  organizationAddFields
} from '../../util/organizationFilters';

import Organization from '../../models/organization';
import bcrypt from "bcrypt";
import mongoose from 'mongoose';

export async function createOrganization(req: Request, res: Response): Promise<any> {
  try {
    const organization = await getOrganizationByUniqueKey(req.body.uniqueKey);
    if(organization){
      return res.status(400).json({ message: "Requested organization unique key already exist" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newOrganization: {[Key: string]: any} = new Organization({
      title: req.body.title,
      description: req.body.description,
      uniqueKey: req.body.uniqueKey,
      password: hashedPassword
    });
    const newOrg = await newOrganization.save();
    newOrg.password = undefined;
    return res.status(200).json(newOrg)
  } catch(err){
    return res.status(500).send(err || err.message);
  }
};

export async function getOrganizationDetails(req: Request, res: Response): Promise<any> {
  try {
    const query = {_id: mongoose.Types.ObjectId(req.params.id)};
    const organizations = await Organization.aggregate([
      { "$match": query },
      departmentsLookup,
      organizationAddFields,
    ]);
    const org: any = organizations ? organizations[0]: null;
    if(org){
      org.uniqueKey = undefined;
      org.password = undefined;
      org.token = undefined;
    }
    return res.status(200).json(org);
  } catch(err){
    return res.status(500).send(err || err.message);
  }
}

export async function deleteOrganization(req: Request, res: Response, next: NextFunction): Promise<any> {
  try{
    const deleted = await Organization.findByIdAndRemove(req.params.id);
    if (!deleted) {
      res.status(500).json({ message: `Cannot delete resource`});
      return next(deleted);
    }
    return res.status(200).json({message: "Resource has been deleted successfully"});
  } catch(err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getOrganizationByUniqueKey(uniqueKey: string): Promise<any> {
  try {
    const organization = await Organization.findOne({ uniqueKey });
    return organization;
  } catch(err){
    return err || err.message;
  }
}

export async function addDepartmentToOrganization(departmentId: string, organizationId: string): Promise<any> {
  try {
    if(!organizationId || !departmentId){
      return;
    }
    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { $push: { departments: departmentId }},
      { new: true, useFindAndModify: false }
    );
    return organization;
  } catch(err){
    throw 'Cannot add department to organization';
  }
}
