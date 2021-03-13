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
  },
};

export {
  departmentsLookup,
  departmentAddFields,
  inActiveDepartmentsLookup,
  activeDepartmentsLookup,
};
