"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completedBoardsLookup = exports.inProgressBoardsLookup = exports.newBoardsLookup = exports.boardAddFields = exports.boardsLookup = void 0;
const sectionFilters_1 = require("./sectionFilters");
const board_1 = __importDefault(require("../models/board"));
const teamFilters_1 = require("./teamFilters");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmRGaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9ib2FyZEZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscURBQW9FO0FBRXBFLDREQUFvQztBQUNwQywrQ0FBMkQ7QUFFM0QsTUFBTSxZQUFZLEdBQUc7SUFDbkIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGVBQUssQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMzQixHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO1FBQzFCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUN4RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtZQUNELHlCQUFXO1lBQ1gsMkJBQWE7WUFDYiwrQkFBYztZQUNkLGlDQUFnQjtTQUNqQjtRQUNELEVBQUUsRUFBRSxRQUFRO0tBQ2I7Q0FDRixDQUFDO0FBZ0VBLG9DQUFZO0FBOURkLE1BQU0sc0JBQXNCLEdBQUc7SUFDN0IsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGVBQUssQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMzQixHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO1FBQzFCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN2RCxNQUFNLEVBQUUsUUFBUTtpQkFDakI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLGtCQUFrQjtLQUN2QjtDQUNGLENBQUM7QUFtREEsd0RBQXNCO0FBakR4QixNQUFNLHFCQUFxQixHQUFHO0lBQzVCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxlQUFLLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDM0IsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTtRQUMxQixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDdkQsTUFBTSxFQUFFLFdBQVc7aUJBQ3BCO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxpQkFBaUI7S0FDdEI7Q0FDRixDQUFDO0FBb0NBLHNEQUFxQjtBQWxDdkIsTUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGVBQUssQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMzQixHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO1FBQzFCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN2RCxNQUFNLEVBQUUsU0FBUztpQkFDbEI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFdBQVc7S0FDaEI7Q0FDRixDQUFDO0FBa0JBLDBDQUFlO0FBaEJqQixNQUFNLGNBQWMsR0FBRztJQUNyQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsU0FBUztRQUNqQixnQkFBZ0IsRUFBRSxtQkFBbUI7UUFDckMsU0FBUyxFQUFFLFlBQVk7UUFDdkIsZUFBZSxFQUFFLGtCQUFrQjtRQUNuQyxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwRCxxQkFBcUIsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUQsb0JBQW9CLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ3ZFO0NBQ0YsQ0FBQztBQUlBLHdDQUFjIn0=