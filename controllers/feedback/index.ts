import { NextFunction, Request, Response } from "express";

import Feedback from "../../models/feedback";

export async function getFeedbacks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const query = req.query.like ? { like: req.query.like } : {};
  const feedbacks = await Feedback.find(query);
  if (!feedbacks) {
    res.status(500).json({
      message: "Internal server error, Unable to get customer feedbacks",
    });
    return next(feedbacks);
  }
  return res.status(200).send(feedbacks);
}

export async function createFeedback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const feedback = new Feedback({
    title: req.body.title,
    description: req.body.description,
    like: req.body.like,
  });
  const feedbackCreated = await feedback.save();
  if (!feedbackCreated) {
    res.status(500).send(feedbackCreated);
    return next(feedbackCreated);
  }
  return res.status(200).send(feedbackCreated);
}
