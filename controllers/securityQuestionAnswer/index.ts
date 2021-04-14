import {
  ANSWER_NOT_MATCHING,
  INCORRECT_PASSWORD,
  USER_NOT_FOUND,
} from "../../util/constants";
import { Request, Response } from "express";

import SecurityQuestionAnswer from "../../models/securityQuestionAnswer";
import User from "../../models/user";
import bcrypt from "bcrypt";
import { getUser } from "../../util";

// import mongoose from "mongoose";

export async function createSecurityQuestionAnswer(
  req: Request,
  res: Response
) {
  try {
    if (!req.body.questionId || !req.body.value || !req.body.password) {
      return;
    }
    const user = await getUser(req.headers.authorization as string);
    const userFromDb: any = await User.findById(user?._id);
    if (!userFromDb) {
      return res.status(500).json({
        errorId: USER_NOT_FOUND,
        errorMessage: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userFromDb?.password
    );
    if (!isPasswordValid) {
      return res.status(422).json({
        errorId: INCORRECT_PASSWORD,
        errorMessage: "Incorrect Password",
      });
    }

    const query = {
        $and: [
          { userId: userFromDb?._id },
          { questionId: req.body.questionId },
        ],
      },
      update = {
        $set: {
          userId: userFromDb?._id,
          questionId: req.body.questionId,
          value: req.body.value,
        },
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updated: any = await SecurityQuestionAnswer.findOneAndUpdate(
      query,
      update,
      options
    );

    return res
      .status(200)
      .send({ ...updated, message: "Answer saved Successfully" });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function verifySecurityQuestionAnswer(
  req: Request,
  res: Response
) {
  try {
    if (!req.body.questionId || !req.body.value) {
      return;
    }
    const user = await getUser(req.headers.authorization as string);
    const userFromDb: any = await User.findById(user?._id);
    if (!userFromDb) {
      return res.status(500).json({
        errorId: USER_NOT_FOUND,
        errorMessage: "User not found",
      });
    }
    const answer = await SecurityQuestionAnswer.findOne({
      $and: [
        {
          userId: userFromDb?._id,
        },
        {
          questionId: req.body.questionId,
        },
        {
          value: req.body.value,
        },
      ],
    });
    if (!answer) {
      return res.status(500).json({
        errorId: ANSWER_NOT_MATCHING,
        errorMessage: "Answer is incorrect",
      });
    }

    await SecurityQuestionAnswer.findByIdAndUpdate(user._id, {
      answered: true,
    });

    return res
      .status(200)
      .send({ verified: true, message: "Answer verified Successfully" });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
