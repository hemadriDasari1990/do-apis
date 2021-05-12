import { Request, Response } from "express";

import Feedback from "../../models/feedback";
import { getUser } from "../../util";
import { userLookup } from "../../util/userFilters";
import { CREATION_FAILED } from "../../util/constants";

export async function getFeedbacks(req: Request, res: Response): Promise<any> {
  try {
    const query = {
      rating: {
        $gt: Number(req.query.rating),
      },
      isApproved: req.query.isApproved,
    };
    const aggregators = [];
    aggregators.push({
      $facet: {
        data: [
          { $match: query },
          { $sort: { _id: -1 } },
          { $limit: parseInt(req.query.limit as string) },
          userLookup,
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const feedbacks = await Feedback.aggregate(aggregators);
    return res.status(200).send(feedbacks?.length ? feedbacks[0] : null);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function createFeedback(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const user = getUser(req.headers.authorization as string);
    const feedback = new Feedback({
      title: req.body?.title,
      description: req.body?.description,
      rating: req.body?.rating,
      userId: user?._id,
    });
    const feedbackCreated = await feedback.save();
    if (!feedbackCreated) {
      res.status(500).send({
        errorId: CREATION_FAILED,
        message: "Error while sending feedback",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Feedback has been sent successfully",
    });
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}
