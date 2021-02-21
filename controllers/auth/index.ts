import { NextFunction, Request, Response } from "express";

import Organization from "../../models/organization";
import bcrypt from "bcrypt";
import config from "config";
import { getOrganizationByUniqueKey } from "../organization";
import jwt from "jsonwebtoken";
import { socket } from "../../index";

export async function authenticateJWT(req: Request, res: Response, next: NextFunction): Promise<any> {
    const authHeader: string = req.headers.authorization as string;
    if (authHeader) {
        const token: string = authHeader.split(' ')[1];
        const organization: any = await Organization.findOne({ token: token });
        let secret: any;
        if(organization?.token){
          secret = config.get("refreshTokenSecret");
        } else {
          secret = config.get("accessTokenSecret");
        }
        jwt.verify(token, secret, (err: any, user: any) => {
            if (err) {
                return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
            }
            if (!user) {
                return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
            } else {
                return next();
            }
        });
    } else {
        return res.status(401).json({ status: "error", code: "UNAUTHORIZED" });
    }
}

export async function login(req: Request, res: Response): Promise<any> {
    try {
      const uniqueKey: string = req.body.uniqueKey;
      const password: string = req.body.password;
      const organization: {[Key: string]: any} = await getOrganizationByUniqueKey(uniqueKey);
      if(!organization?._id){
        return res.status(422).json({ message: "Please enter valid unique key" });
      }
      // Check password
      const isPasswordValid = await bcrypt.compare(password, organization.password);
      if (!isPasswordValid) return res.status(422).json({ message: "Invalid Password" });
      const payload = {
        _id: organization._id,
        title: organization.title,
        description: organization.description
      };
  
      // Sign token
      const token = await generateToken(payload);
      if(!token){
        return res.status(500).json({ message: "Error while logging in" });
      } 
      const refreshToken = await refreshAccessToken(payload);
      if(!refreshToken){
        return res.status(500).json({ message: "Error while logging in" });
      } 
      await Organization.findByIdAndUpdate(organization._id, { token: refreshToken });
      await socket.emit(`login-success`);
      return res.status(200).json({
        success: true,
        token: token,
        refreshToken: refreshToken
      });
    } catch(err){
      return res.status(500).json({ message: err | err.message });
    }
  };

  export async function refreshToken(req: Request, res: Response): Promise<any> {
    try {
      const organization: any = await Organization.findOne({ token: req.body.refreshToken });
      if (!organization) {
        return res.status(401).json({ error: "Token expired!" });
      }
        //extract payload from refresh token and generate a new access token and send it
        const payload: any = jwt.verify(organization?.token, config.get("refreshTokenSecret"));
        // Sign token
        const token = await refreshAccessToken(payload);
        if(!token){
            return res.status(500).json({ message: "Error while generating the token" });
        } 
        return res.status(200).json({
          success: true,
          token: token
        });
    } catch(err){
      return res.status(500).send(err || err.message);
    }
  };

  export async function logout(req: Request, res: Response): Promise<any> {
    try {
        await Organization.findByIdAndUpdate(req.body.organizationId, { token: null });
        return res.status(200).json({ success: "User logged out!" });
    } catch(err){
      return res.status(500).send(err || err.message);
    }
  };

export async function generateToken(payload: {[Key: string]: any}): Promise<string> {
  try {
    const token: string = await jwt.sign(
      payload,
      config.get("accessTokenSecret"),
      {
        expiresIn: "1hr" // 1 hr
      });
    return token; 
  } catch(err){
    throw err | err.message;
  }  
}

export async function refreshAccessToken(payload: {[Key: string]: any}): Promise<string> {
  try {
    delete payload["exp"];
    const token: string = await jwt.sign(
      payload,
      config.get("refreshTokenSecret"),
      {
        expiresIn: "1d" // 24 hrs
      });
    return token;  
  } catch(err){
    throw err | err.message;
  }
}