"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectLookup = exports.projectAddTotalFields = exports.userLookup = exports.privateProjectsLookup = exports.publicProjectsLookup = exports.activeProjectsLookup = exports.inActiveProjectsLookup = exports.projectAddFields = exports.projectsLookup = void 0;
const boardFilters_1 = require("./boardFilters");
const project_1 = __importDefault(require("../models/project"));
const user_1 = __importDefault(require("../models/user"));
const userLookup = {
    $lookup: {
        from: user_1.default.collection.name,
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
exports.userLookup = userLookup;
const projectLookup = {
    $lookup: {
        from: project_1.default.collection.name,
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
exports.projectLookup = projectLookup;
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
            userLookup,
            boardFilters_1.completedBoardsLookup,
            boardFilters_1.inProgressBoardsLookup,
            boardFilters_1.newBoardsLookup,
            boardFilters_1.boardsLookup,
            boardFilters_1.boardAddFields,
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
        totalBoards: { $size: { $ifNull: ["$projects.totalBoards", []] } },
        totalInProgressBoards: { $size: { $ifNull: ["$inProgressBoards", []] } },
        totalNewBoards: { $size: { $ifNull: ["$newBoards", []] } },
        totalCompletedBoards: { $size: { $ifNull: ["$completedBoards", []] } },
    },
};
exports.projectAddFields = projectAddFields;
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
    },
};
exports.projectAddTotalFields = projectAddTotalFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdEZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3Byb2plY3RGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlEQU13QjtBQUV4QixnRUFBd0M7QUFDeEMsMERBQWtDO0FBRWxDLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtRQUMxQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFO2lCQUNyQzthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsTUFBTTtLQUNYO0NBQ0YsQ0FBQztBQTJKQSxnQ0FBVTtBQXpKWixNQUFNLGFBQWEsR0FBRztJQUNwQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM3QixHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1FBQ2hDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUU7aUJBQ3hDO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxTQUFTO0tBQ2Q7Q0FDRixDQUFDO0FBOElBLHNDQUFhO0FBNUlmLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzdCLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7UUFDOUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxF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