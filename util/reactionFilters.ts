import Reaction from "../models/reaction";
import { reactedByLookup } from "./memberFilters";

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
      reactedByLookup,
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
      reactedByLookup,
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

const reactionHighlightLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "highlight",
        },
      },
      reactedByLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "highlightReactions",
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
      reactedByLookup,
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

const reactionMinusOneLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "minusOne",
        },
      },
      reactedByLookup,
      {
        $unwind: {
          path: "$reactedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "minuOneReactions",
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
      reactedByLookup,
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
    totalHighlight: { $size: { $ifNull: ["$highlightReactions", []] } },
    totalDeserve: { $size: { $ifNull: ["$deserveReactions", []] } },
    totalMinusOne: { $size: { $ifNull: ["$minuOneReactions", []] } },
    totalLove: { $size: { $ifNull: ["$loveReactions", []] } },
  },
};

export {
  reactionLookup,
  reactionPlusOneLookup,
  reactionHighlightLookup,
  reactionDeserveLookup,
  reactionMinusOneLookup,
  reactionLoveLookup,
  reactionAddFields,
};
