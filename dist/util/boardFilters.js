"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completedBoardsLookup = exports.inProgressBoardsLookup = exports.newBoardsLookup = exports.boardAddFields = exports.boardsLookup = void 0;
const sectionFilters_1 = require("./sectionFilters");
const teamFilters_1 = require("./teamFilters");
const board_1 = __importDefault(require("../models/board"));
const project_1 = __importDefault(require("../models/project"));
const boardsLookup = {
    $lookup: {
        from: board_1.default.collection.name,
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
            },
            {
                $unwind: {
                    path: "$project",
                    preserveNullAndEmptyArrays: true,
                },
            },
            teamFilters_1.teamsLookup,
            teamFilters_1.teamAddFields,
            sectionFilters_1.sectionsLookup,
            sectionFilters_1.sectionAddFields,
        ],
        as: "boards",
    },
};
exports.boardsLookup = boardsLookup;
const inProgressBoardsLookup = {
    $lookup: {
        from: board_1.default.collection.name,
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
exports.inProgressBoardsLookup = inProgressBoardsLookup;
const completedBoardsLookup = {
    $lookup: {
        from: board_1.default.collection.name,
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
exports.completedBoardsLookup = completedBoardsLookup;
const newBoardsLookup = {
    $lookup: {
        from: board_1.default.collection.name,
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
                    status: "pending",
                },
            },
        ],
        as: "newBoards",
    },
};
exports.newBoardsLookup = newBoardsLookup;
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
exports.boardAddFields = boardAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmRGaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9ib2FyZEZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscURBQW9FO0FBQ3BFLCtDQUEyRDtBQUUzRCw0REFBb0M7QUFDcEMsZ0VBQXdDO0FBRXhDLE1BQU0sWUFBWSxHQUFHO0lBQ25CLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxlQUFLLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDM0IsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtRQUMxQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDeEQ7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7YUFDbEI7WUFDRDtnQkFDRSxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUk7b0JBQzdCLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7b0JBQ2hDLFFBQVEsRUFBRTt3QkFDUjs0QkFDRSxNQUFNLEVBQUU7Z0NBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxFQUFFOzZCQUN4Qzt5QkFDRjtxQkFDRjtvQkFDRCxFQUFFLEVBQUUsU0FBUztpQkFDZDthQUNGO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxVQUFVO29CQUNoQiwwQkFBMEIsRUFBRSxJQUFJO2lCQUNqQzthQUNGO1lBQ0QseUJBQVc7WUFDWCwyQkFBYTtZQUNiLCtCQUFjO1lBQ2QsaUNBQWdCO1NBQ2pCO1FBQ0QsRUFBRSxFQUFFLFFBQVE7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