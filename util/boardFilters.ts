import { sectionAddFields, sectionsLookup } from "./sectionFilters";

import Board from "../models/board";

const boardsLookup = {
  $lookup: {
    from: Board.collection.name,
    let: { boards: "$boards" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
      sectionsLookup,
      sectionAddFields,
    ],
    as: "boards",
  },
};

const inProgressBoardsLookup = {
  $lookup: {
    from: Board.collection.name,
    let: { boards: "$boards" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
          status: "boards",
        },
      },
    ],
    as: "inProgressBoards",
  },
};

const completedBoardsLookup = {
  $lookup: {
    from: Board.collection.name,
    let: { boards: "$boards" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
          status: "completed",
        },
      },
    ],
    as: "completedBoards",
  },
};

const newBoardsLookup = {
  $lookup: {
    from: Board.collection.name,
    let: { boards: "$boards" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
          status: "pending",
        },
      },
    ],
    as: "newBoards",
  },
};

const boardAddFields = {
  $addFields: {
    boards: "$boards",
    inProgressBoards: "$inProgressBoards",
    newBoards: "$newBoards",
    completedBoards: "$completedBoards",
    totalBoards: { $size: { $ifNull: ["$boards", []] } },
    totalInProgressBoards: { $size: { $ifNull: ["$inProgressBoards", []] } },
    totalNewBoards: { $size: { $ifNull: ["$newBoards", []] } },
    totalCompletedBoards: { $size: { $ifNull: ["$completedBoards", []] } },
  },
};

export {
  boardsLookup,
  boardAddFields,
  newBoardsLookup,
  inProgressBoardsLookup,
  completedBoardsLookup,
};
