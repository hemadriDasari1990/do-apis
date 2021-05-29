import { Request, Response } from "express";

import { CREATION_FAILED } from "../../util/constants";
import Recommendation from "../../models/recommendation";

export async function createRecommendation(req: Request, res: Response) {
  try {
    if (!req.body) {
      return;
    }
    const recommendation = new Recommendation(req.body);
    const saved = await recommendation.save();
    if (!saved) {
      res.status(500).send({
        errorId: CREATION_FAILED,
        message: "Error while saving recommendation",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Recommendation has been sent successfully",
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function getRecommendations(req: Request, res: Response) {
  try {
    const recommendations = await Recommendation.find({});
    return res.status(200).send(recommendations);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
