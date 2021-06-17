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

const reactionAgreeLookup = {
  $lookup: {
    from: Reaction.collection.name,
    let: { reactions: "$reactions" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
          type: "agree",
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
    as: "agreeReactions",
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

const reactionDisagreeLookup = {
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
    totalAgree: { $size: { $ifNull: ["$agreeReactions", []] } },
    totalHighlight: { $size: { $ifNull: ["$highlightReactions", []] } },
    totalDeserve: { $size: { $ifNull: ["$deserveReactions", []] } },
    totalDisagree: { $size: { $ifNull: ["$minuOneReactions", []] } },
    totalLove: { $size: { $ifNull: ["$loveReactions", []] } },
  },
};

export {
  reactionLookup,
  reactionAgreeLookup,
  reactionHighlightLookup,
  reactionDeserveLookup,
  reactionDisagreeLookup,
  reactionLoveLookup,
  reactionAddFields,
};
