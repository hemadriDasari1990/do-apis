import Reaction from "../models/reaction";

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
        $sort: { _id: 1 },
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
