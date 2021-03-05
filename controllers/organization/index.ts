import { NextFunction, Request, Response } from "express";
import {
  departmentsLookup,
  organizationAddFields,
} from "../../util/organizationFilters";

import EmailService from "../../services/email";
import Organization from "../../models/organization";
import Token from "../../models/token";
import config from "config";
import crypto from "crypto";
// import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function createOrganization(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const emailService = await new EmailService();
    const organization = await getOrganizationByEmail(req.body.email);
    if (organization && !organization?.isVerified) {
      return res.status(400).json({
        errorId: "ORGANIZATION_ALREADY_EXIST",
        message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
      });
    }

    if (organization && organization?.isVerified) {
      return res.status(400).json({
        errorId: "EMAIL_VERIFIED",
        message: `An account with following email ${req.body.email} already exist and verified. Please login!`,
      });
    }

    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // if(!hashedPassword){
    //   return res
    //       .status(400)
    //       .json({ message: 'Error hashing password' });
    // }

    const newOrganization: { [Key: string]: any } = new Organization({
      title: req.body.title,
      description: req.body.description,
      email: req.body.email,
      password: req.body.password,
    });
    const newOrg = await newOrganization.save();
    newOrg.password = undefined;

    const token = new Token({
      organizationId: newOrganization._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    const newToken: any = await token.save();
    //@TODO - Send Email Activation Link
    await emailService.sendEmail(
      "/templates/account-confirmation.ejs",
      {
        url: config.get("url"),
        confirm_link: `${config.get("url")}/verify/${newToken?.token}`,
        name: req.body.title,
      },
      req.body.email,
      "Please confirm your email"
    );
    return res.status(200).json({
      message:
        "An email verification link has been sent. Please check your inbox",
      newOrg,
    });
  } catch (err) {
    return res.status(500).json(err || err.message);
  }
}

export async function confirmEmail(req: Request, res: Response): Promise<any> {
  try {
    const token: any = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).send({
        message:
          "Your verification link may have expired. Please click on resend for verify your Email.",
      });
    }
    const organization: any = await Organization.findOne({
      _id: mongoose.Types.ObjectId(token.organizationId),
      email: req.params.email,
    });
    if (!organization) {
      return res.status(401).send({
        message: `We are unable to find a organization account associated with ${req.params.email} for this verification. Please SignUp!`,
      });
    }
    if (organization.isVerified) {
      return res
        .status(200)
        .send("Organization has been already verified. Please Login");
    }
    organization.isVerified = true;
    await organization.save();
    //@TODO - Send successfully verified Email
    return res
      .status(200)
      .send("Your account has been successfully verified. Please login now");
  } catch (err) {
    return res.status(500).json(err || err.message);
  }
}
export async function resendActivationLink(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const organization: any = await Organization.findOne({
      email: req.params.email,
    });
    if (!organization) {
      return res.status(401).send({
        message: `We are unable to find an organization account associated with ${req.body.email}. Make sure your Email is correct!`,
      });
    }
    if (organization.isVerified) {
      return res
        .status(200)
        .send("Organization has been already verified. Please Login");
    }
    const token = new Token({
      organizationId: organization._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    //@TODO - Send Email Activation Link
  } catch (err) {
    return res.status(500).json(err || err.message);
  }
}

export async function getOrganizationDetails(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const query = { _id: mongoose.Types.ObjectId(req.params.id) };
    const organizations = await Organization.aggregate([
      { $match: query },
      departmentsLookup,
      organizationAddFields,
    ]);
    const org: any = organizations ? organizations[0] : null;
    if (org) {
      org.uniqueKey = undefined;
      org.password = undefined;
      org.token = undefined;
    }
    return res.status(200).json(org);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function deleteOrganization(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const deleted = await Organization.findByIdAndRemove(req.params.id);
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

export async function getOrganizationByEmail(email: string): Promise<any> {
  try {
    const organization = await Organization.findOne({ email: email });
    return organization;
  } catch (err) {
    return err || err.message;
  }
}

export async function addDepartmentToOrganization(
  departmentId: string,
  organizationId: string
): Promise<any> {
  try {
    if (!organizationId || !departmentId) {
      return;
    }
    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { $push: { departments: departmentId } },
      { new: true, useFindAndModify: false }
    );
    return organization;
  } catch (err) {
    throw "Cannot add department to organization";
  }
}
