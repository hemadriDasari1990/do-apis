"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completedBoardsLookup = exports.inProgressBoardsLookup = exports.newBoardsLookup = exports.boardAddFields = exports.boardsLookup = void 0;
const sectionFilters_1 = require("./sectionFilters");
const board_1 = __importDefault(require("../models/board"));
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
                    $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
                    status: "boards",
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
                    $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
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
                    $expr: { $in: ["$_id", { $ifNull: ["$$boards", []] }] },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmRGaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9ib2FyZEZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscURBQW9FO0FBRXBFLDREQUFvQztBQUVwQyxNQUFNLFlBQVksR0FBRztJQUNuQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsZUFBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzNCLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7UUFDMUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQ3hEO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO2FBQ2xCO1lBQ0QsK0JBQWM7WUFDZCxpQ0FBZ0I7U0FDakI7UUFDRCxFQUFFLEVBQUUsUUFBUTtLQUNiO0NBQ0YsQ0FBQztBQWdFQSxvQ0FBWTtBQTlEZCxNQUFNLHNCQUFzQixHQUFHO0lBQzdCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxlQUFLLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDM0IsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtRQUMxQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDdkQsTUFBTSxFQUFFLFFBQVE7aUJBQ2pCO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxrQkFBa0I7S0FDdkI7Q0FDRixDQUFDO0FBbURBLHdEQUFzQjtBQWpEeEIsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsZUFBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzNCLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7UUFDMUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ3ZELE1BQU0sRUFBRSxXQUFXO2lCQUNwQjthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsaUJBQWlCO0tBQ3RCO0NBQ0YsQ0FBQztBQW9DQSxzREFBcUI7QUFsQ3ZCLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxlQUFLLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDM0IsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtRQUMxQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDdkQsTUFBTSxFQUFFLFNBQVM7aUJBQ2xCO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxXQUFXO0tBQ2hCO0NBQ0YsQ0FBQztBQWtCQSwwQ0FBZTtBQWhCakIsTUFBTSxjQUFjLEdBQUc7SUFDckIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFNBQVM7UUFDakIsZ0JBQWdCLEVBQUUsbUJBQW1CO1FBQ3JDLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLGVBQWUsRUFBRSxrQkFBa0I7UUFDbkMsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDcEQscUJBQXFCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hFLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFELG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUN2RTtDQUNGLENBQUM7QUFJQSx3Q0FBYyJ9