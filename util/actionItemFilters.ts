import Member from "../models/member";
import ActionItem from "../models/actionItem";
import Action from "../models/action";

const actionItemAddFields = {
  $addFields: {
    actionItems: "$actionItems",
    totalActionItems: { $size: { $ifNull: ["$actionItems", []] } },
    action: { $ifNull: ["$action", [null]] },
    assignedBy: { $ifNull: ["$assignedBy", [null]] },
    assignedTo: { $ifNull: ["$assignedTo", [null]] },
  },
};

const actionActionItemAddFields = {
  $addFields: {
    totalAction: { $size: { $ifNull: ["$actionItems", []] } },
    actionItems: [],
  },
};

const assignedByLookUp = {
  $lookup: {
    from: Member.collection.name,
    let: { assignedById: "$assignedById" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", { $ifNull: ["$$assignedById", []] }] },
        },
      },
    ],
    as: "assignedBy",
  },
};

const assignedToLookUp = {
  $lookup: {
    from: Member.collection.name,
    let: { assignedToId: "$assignedToId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", { $ifNull: ["$$assignedToId", []] }] },
        },
      },
    ],
    as: "assignedTo",
  },
};

const actionItemsLookup = {
  $lookup: {
    from: ActionItem.collection.name,
    let: { actionItems: "$actionItems" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$actionItems", []] }] },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $lookup: {
          from: Action.collection.name,
          let: { actionId: "$actionId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$actionId"] },
              },
            },
          ],
          as: "action",
        },
      },
      {
        $unwind: {
          path: "$action",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "actionItems",
  },
};

export {
  actionItemAddFields,
  actionActionItemAddFields,
  assignedByLookUp,
  assignedToLookUp,
  actionItemsLookup,
};
