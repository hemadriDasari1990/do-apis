import Reaction from "../models/reaction";
import { memberLookup } from "./memberFilters";

const reactionLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
        },
      },
      {
        $sort: { _id: -1 },
      },
      memberLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "reactions",
  },
};

const reactionPlusOneLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "plusOne",
        },
      },
      memberLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "plusOneReactions",
  },
};

const reactionPlusTwoLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "plusTwo",
        },
      },
      memberLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "plusTwoReactions",
  },
};

const reactionDeserveLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "deserve",
        },
      },
      memberLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "deserveReactions",
  },
};

const reactionDisAgreeLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "disagree",
        },
      },
      memberLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "disAgreeReactions",
  },
};

const reactionLoveLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "love",
        },
      },
      memberLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "loveReactions",
  },
};

const reactionAddFields = {
  $addFields: {
    totalReactions: { $size: { $ifNull: ["$reactions", []] } },
    totalPlusOne: { $size: { $ifNull: ["$plusOneReactions", []] } },
    totalPlusTwo: { $size: { $ifNull: ["$plusTwoReactions", []] } },
    totalDeserve: { $size: { $ifNull: ["$deserveReactions", []] } },
    totalDisAgreed: { $size: { $ifNull: ["$disAgreeReactions", []] } },
    totalLove: { $size: { $ifNull: ["$loveReactions", []] } },
  },
};

export {
  reactionLookup,
  reactionPlusOneLookup,
  reactionPlusTwoLookup,
  reactionDeserveLookup,
  reactionDisAgreeLookup,
  reactionLoveLookup,
  reactionAddFields,
};
