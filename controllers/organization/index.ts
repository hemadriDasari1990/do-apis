import { NextFunction, Request, Response } from "express";
import {
  departmentsLookup,
  organizationAddFields
} from '../../util/organizationFilters';

import Organization from '../../models/organization';
import bcrypt from "bcryptjs";
import config from "config";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

export async function createOrganization(req: Request, res: Response): Promise<any> {
  try {
    const organization = await getOrganizationByUniqueKey(req.body.uniqueKey);
    if(organization){
      return res.status(400).json({ message: "Requested organization unique key already exist" });
    }
    const newOrganization: {[Key: string]: any} = new Organization({
      title: req.body.title,
      description: req.body.description,
      uniqueKey: req.body.uniqueKey,
      password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw salt;
    const hash = await bcrypt.hash(newOrganization.password, salt);
    if (!hash) throw hash;
    newOrganization.password = hash;
    const newOrg = await newOrganization.save();
    return res.status(200).json(newOrg)
  } catch(err){
    return res.status(500).send(err || err.message);
  }
};

export async function login(req: Request, res: Response): Promise<any> {
  try {
    const uniqueKey: string = req.body.uniqueKey;
    const password: string = req.body.password;
    const organization: {[Key: string]: any} = await getOrganizationByUniqueKey(uniqueKey);
    if(!organization?._id){
      return res.status(404).json({ message: "Invalid unique key" });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, organization.password);
    if (!isPasswordValid) return res.status(404).json({ message: "Invalid Password" });
    const payload = {
      _id: organization._id,
      title: organization.title
    };

    // Sign token
    const token = await jwt.sign(
      payload,
      config.get("secret"),
      {
        expiresIn: 31556926 // 1 year in seconds
      });
    if(!token){
      return res.status(500).json({ message: "Error while logging in" });
    } 
    return res.status(200).json({
      success: true,
      token: "Bearer " + token
    });
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
    return res.status(200).json(organizations ? organizations[0]: null);
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

async function getOrganizationByUniqueKey(uniqueKey: string): Promise<any> {
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
