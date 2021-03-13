import {
  boardAddFields,
  boardsLookup,
  completedBoardsLookup,
  inProgressBoardsLookup,
  newBoardsLookup,
} from "./boardFilters";

import Project from "../models/project";

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
      boardsLookup,
      completedBoardsLookup,
      inProgressBoardsLookup,
      newBoardsLookup,
      boardAddFields,
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
          private: false,
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
          private: true,
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
  },
};

export {
  projectsLookup,
  projectAddFields,
  inActiveProjectsLookup,
  activeProjectsLookup,
  publicProjectsLookup,
  privateProjectsLookup,
};
