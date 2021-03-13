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
                    private: false,
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
                    private: true,
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