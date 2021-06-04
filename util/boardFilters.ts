import { sectionAddFields, sectionsLookup } from "./sectionFilters";
import { teamAddFields, teamsLookup } from "./teamFilters";

import Board from "../models/board";
import Join from "../models/join";
import Project from "../models/project";

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
      {
        $lookup: {
          from: Project.collection.name,
          let: { projectId: "$projectId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$projectId"] },
              },
            },
          ],
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },
      teamsLookup,
      teamAddFields,
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
          $expr: {
            $in: [
              "$_id",
              {
                $ifNull: ["$$boards", []],
              },
            ],
          },
          status: "inprogress",
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
          $expr: {
            $in: [
              "$_id",
              {
                $ifNull: ["$$boards", []],
              },
            ],
          },
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
          $expr: {
            $in: [
              "$_id",
              {
                $ifNull: ["$$boards", []],
              },
            ],
          },
          status: "new",
        },
      },
    ],
    as: "newBoards",
  },
};

const joinedMembersLookup = {
  $lookup: {
    from: Join.collection.name,
    let: { joinedMembers: "$joinedMembers" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$joinedMembers", []] }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ],
    as: "joinedMembers",
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
  joinedMembersLookup,
};
