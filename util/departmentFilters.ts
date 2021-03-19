import {
  activeProjectsLookup,
  inActiveProjectsLookup,
  privateProjectsLookup,
  projectAddFields,
  projectsLookup,
  publicProjectsLookup,
} from "./projectFilters";

import Department from "../models/department";

const departmentsLookup = {
  $lookup: {
    from: Department.collection.name,
    let: { departments: "$departments" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$departments", []] }] },
        },
      },
      // {
      //   $group: {
      //     _id: null,
      //     totalProjects: { $sum: { $size: "$projectId" } },
      //   },
      // },
      {
        $sort: { _id: 1 },
      },

      projectsLookup,
      activeProjectsLookup,
      inActiveProjectsLookup,
      privateProjectsLookup,
      publicProjectsLookup,
      projectAddFields,
    ],
    as: "departments",
  },
};

const inActiveDepartmentsLookup = {
  $lookup: {
    from: Department.collection.name,
    let: { departments: "$departments" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$departments", []] }] },
          status: "inactive",
        },
      },
    ],
    as: "inActiveDepartments",
  },
};

const activeDepartmentsLookup = {
  $lookup: {
    from: Department.collection.name,
    let: { departments: "$departments" },
    pipeline: [
      {
        $match: {
          $expr: { $in: ["$_id", { $ifNull: ["$$departments", []] }] },
          status: "active",
        },
      },
    ],
    as: "activeDepartments",
  },
};

const departmentAddFields = {
  $addFields: {
    departments: "$departments",
    activeDepartments: "$activeDepartments",
    inActiveDepartments: "$inActiveDepartments",
    totalDepartments: { $size: { $ifNull: ["$departments", []] } },
    totalActiveDepartments: { $size: { $ifNull: ["$activeDepartments", []] } },
    totalInActiveDepartments: {
      $size: { $ifNull: ["$inActiveDepartments", []] },
    },
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
  departmentsLookup,
  inActiveDepartmentsLookup,
  activeDepartmentsLookup,
  departmentAddFields,
};
