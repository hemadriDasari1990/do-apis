"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateProjectsLookup = exports.publicProjectsLookup = exports.activeProjectsLookup = exports.inActiveProjectsLookup = exports.projectAddFields = exports.projectsLookup = void 0;
const boardFilters_1 = require("./boardFilters");
const project_1 = __importDefault(require("../models/project"));
const projectsLookup = {
    $lookup: {
        from: project_1.default.collection.name,
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
            boardFilters_1.boardsLookup,
            boardFilters_1.completedBoardsLookup,
            boardFilters_1.inProgressBoardsLookup,
            boardFilters_1.newBoardsLookup,
            boardFilters_1.boardAddFields,
        ],
        as: "projects",
    },
};
exports.projectsLookup = projectsLookup;
const inActiveProjectsLookup = {
    $lookup: {
        from: project_1.default.collection.name,
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
exports.inActiveProjectsLookup = inActiveProjectsLookup;
const activeProjectsLookup = {
    $lookup: {
        from: project_1.default.collection.name,
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
exports.activeProjectsLookup = activeProjectsLookup;
const publicProjectsLookup = {
    $lookup: {
        from: project_1.default.collection.name,
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
exports.publicProjectsLookup = publicProjectsLookup;
const privateProjectsLookup = {
    $lookup: {
        from: project_1.default.collection.name,
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
exports.privateProjectsLookup = privateProjectsLookup;
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
exports.projectAddFields = projectAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdEZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3Byb2plY3RGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlEQU13QjtBQUV4QixnRUFBd0M7QUFFeEMsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDN0IsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtRQUM5QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDMUQ7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7YUFDbEI7WUFDRCwyQkFBWTtZQUNaLG9DQUFxQjtZQUNyQixxQ0FBc0I7WUFDdEIsOEJBQWU7WUFDZiw2QkFBYztTQUNmO1FBQ0QsRUFBRSxFQUFFLFVBQVU7S0FDZjtDQUNGLENBQUM7QUFzRkEsd0NBQWM7QUFwRmhCLE1BQU0sc0JBQXNCLEdBQUc7SUFDN0IsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDN0IsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtRQUM5QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDekQsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxr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