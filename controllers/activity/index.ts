import { Request, Response } from "express";

import Activity from "../../models/activity";
import { getPagination } from "../../util";
import { joinedMemberLookUp } from "../../util/memberFilters";
import mongoose from "mongoose";

export async function createActivity(
  payload: {
    [Key: string]: any;
  },
  session: any
): Promise<any> {
  try {
    const activity = new Activity(payload);
    return await activity.save({ session });
  } catch (err) {
    throw new Error(`Error while creating activity ${err || err.message}`);
  }
}

export async function getActivities(req: Request, res: Response): Promise<any> {
  try {
    const query = {
      boardId: mongoose.Types.ObjectId(req.query.boardId as string),
    };
    const aggregators = [];
    const { limit, offset } = getPagination(
      parseInt(req.query.page as string),
      parseInt(req.query.size as string)
    );
    if (req.query.queryString?.length) {
      aggregators.push({
        $match: {
          $or: [{ title: { $regex: req.query.queryString, $options: "i" } }],
        },
      });
    }
    aggregators.push({
      $facet: {
        data: [
          { $match: query },
          { $sort: { _id: -1 } },
          { $skip: offset },
          { $limit: limit },
          joinedMemberLookUp,
          {
            $unwind: {
              path: "$member",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    });

    const activities = await Activity.aggregate(aggregators);
    return res.status(200).send(activities ? activities[0] : activities);
  } catch (err) {
    return res.status(500).send(err || err.message);
  }
}

export async function findActivitiesByBoardAndDelete(
  boardId: string,
  session: any
): Promise<any> {
  try {
    const activitiesList: any = await Activity.find({ boardId: boardId });
    if (!activitiesList?.length) {
      return;
    }
    const deleted = activitiesList?.reduce(
      async (promise: Promise<any>, activity: { [Key: string]: any }) => {
        await promise;
        await Activity.findByIdAndRemove(activity?._id).session(session);
      },
      [Promise.resolve()]
    );
    return deleted;
  } catch (err) {
    throw err || err.message;
  }
}
