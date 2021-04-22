import Action from "../models/action";
import { actionItemsLookup } from "./actionItemFilters";

const actionsLookup = {
  $lookup: {
    from: Action.collection.name,
    let: { actions: "$actions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$actions", []] }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
      actionItemsLookup,
    ],
    as: "actions",
  },
};

const actionAddFields = {
  $addFields: {
    actions: "$actions",
    totalActions: { $size: { $ifNull: ["$actions", []] } },
  },
};

export { actionsLookup, actionAddFields };
