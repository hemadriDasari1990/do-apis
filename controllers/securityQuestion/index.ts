import { Request, Response } from "express";

import SecurityQuestion from "../../models/securityQuestion";

// import mongoose from "mongoose";

export async function createSecurityQuestion(req: Request, res: Response) {
  try {
    if (!req.body) {
      return;
    }
    const securityQuestion = new SecurityQuestion(req.body);
    const saved = await securityQuestion.save();
    return res.status(200).send(saved);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getSecurityQuestions(req: Request, res: Response) {
  try {
    console.log(req);

    const securityQuestions = await SecurityQuestion.find({});
    return res.status(200).send(securityQuestions);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
