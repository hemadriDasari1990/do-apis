import {
  boardAddFields,
  boardsLookup,
  completedBoardsLookup,
  inProgressBoardsLookup,
  newBoardsLookup,
} from "./boardFilters";

import Project from "../models/project";
import User from "../models/user";

const userLookup = {
  $lookup: {
    from: User.collection.name,
    let: { userId: "$userId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", "$$userId"] },
        },
      },
    ],
    as: "user",
  },
};

const projectLookup = {
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
};

const projectsLookup = {
  $lookup: {
    from: Project.collection.name,
    let: { projects: "$projects" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$projects", []] }] },
        },
      },
      {
        $sort: { _id: 1 },
      },
      userLookup,
      completedBoardsLookup,
      inProgressBoardsLookup,
      newBoardsLookup,
      boardsLookup,
      boardAddFields,
      // {
      //   $unwind: {
      //     path: "$inProgressBoards",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$boards",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$completedBoards",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$newBoards",
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
    as: "projects",
  },
};

const inActiveProjectsLookup = {
  $lookup: {
    from: Project.collection.name,
    let: { projects: "$projects" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$projects", []] }] },
          status: "inactive",
        },
      },
    ],
    as: "inActiveProjects",
  },
};

const activeProjectsLookup = {
  $lookup: {
    from: Project.collection.name,
    let: { projects: "$projects" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$projects", []] }] },
          status: "active",
        },
      },
    ],
    as: "activeProjects",
  },
};

const publicProjectsLookup = {
  $lookup: {
    from: Project.collection.name,
    let: { projects: "$projects" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$projects", []] }] },
          isPrivate: false,
        },
      },
    ],
    as: "publicProjects",
  },
};

const privateProjectsLookup = {
  $lookup: {
    from: Project.collection.name,
    let: { projects: "$projects" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$projects", []] }] },
          isPrivate: true,
        },
      },
    ],
    as: "privateProjects",
  },
};

const projectAddFields = {
  $addFields: {
    projects: "$projects",
    activeProjects: "$activeProjects",
    inActiveProjects: "$inActiveProjects",
    privateProjects: "$privateProjects",
    publicProjects: "$publicProjects",
    totalProjects: { $size: { $ifNull: ["$projects", []] } },
    totalActiveProjects: { $size: { $ifNull: ["$activeProjects", []] } },
    totalInActiveProjects: { $size: { $ifNull: ["$inActiveProjects", []] } },
    totalPrivateProjects: {
      $size: { $ifNull: ["$privateProjects", []] },
    },
    totalPublicProjects: {
      $size: { $ifNull: ["$publicProjects", []] },
    },
    totalBoards: { $sum: "$projects.totalBoards" },
    totalInProgressBoards: {
      $sum: "$projects.totalInProgressBoards",
    },
    totalNewBoards: { $sum: "$projects.totalNewBoards" },
    totalCompletedBoards: { $sum: "$projects.totalCompletedBoards" },
  },
};

const projectAddTotalFields = {
  $addFields: {
    totalProjects: { $size: { $ifNull: ["$projects", []] } },
    totalActiveProjects: { $size: { $ifNull: ["$activeProjects", []] } },
    totalInActiveProjects: { $size: { $ifNull: ["$inActiveProjects", []] } },
    totalPrivateProjects: {
      $size: { $ifNull: ["$privateProjects", []] },
    },
    totalPublicProjects: {
      $size: { $ifNull: ["$publicProjects", []] },
    },
    totalBoards: { $sum: "$projects.totalBoards" },
    totalInProgressBoards: {
      $sum: "$projects.totalInProgressBoards",
    },
    totalNewBoards: { $sum: "$projects.totalNewBoards" },
    totalCompletedBoards: { $sum: "$projects.totalCompletedBoards" },
  },
};

export {
  projectsLookup,
  projectAddFields,
  inActiveProjectsLookup,
  activeProjectsLookup,
  publicProjectsLookup,
  privateProjectsLookup,
  userLookup,
  projectAddTotalFields,
  projectLookup,
};
