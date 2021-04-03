"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionAddFields = exports.reactionLoveLookup = exports.reactionMinusOneLookup = exports.reactionDeserveLookup = exports.reactionPlusTwoLookup = exports.reactionPlusOneLookup = exports.reactionLookup = void 0;
const reaction_1 = __importDefault(require("../models/reaction"));
const memberFilters_1 = require("./memberFilters");
const reactionLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                },
            },
            {
                $sort: { _id: -1 },
            },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "reactions",
    },
};
exports.reactionLookup = reactionLookup;
const reactionPlusOneLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                    type: "plusOne",
                },
            },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "plusOneReactions",
    },
};
exports.reactionPlusOneLookup = reactionPlusOneLookup;
const reactionPlusTwoLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                    type: "plusTwo",
                },
            },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "plusTwoReactions",
    },
};
exports.reactionPlusTwoLookup = reactionPlusTwoLookup;
const reactionDeserveLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                    type: "deserve",
                },
            },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "deserveReactions",
    },
};
exports.reactionDeserveLookup = reactionDeserveLookup;
const reactionMinusOneLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                    type: "minusOne",
                },
            },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "minuOneReactions",
    },
};
exports.reactionMinusOneLookup = reactionMinusOneLookup;
const reactionLoveLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                    type: "love",
                },
            },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ],
        as: "loveReactions",
    },
};
exports.reactionLoveLookup = reactionLoveLookup;
const reactionAddFields = {
    $addFields: {
        totalReactions: { $size: { $ifNull: ["$reactions", []] } },
        totalPlusOne: { $size: { $ifNull: ["$plusOneReactions", []] } },
        totalPlusTwo: { $size: { $ifNull: ["$plusTwoReactions", []] } },
        totalDeserve: { $size: { $ifNull: ["$deserveReactions", []] } },
        totalMinusOne: { $size: { $ifNull: ["$minuOneReactions", []] } },
        totalLove: { $size: { $ifNull: ["$loveReactions", []] } },
    },
};
exports.reactionAddFields = reactionAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Rpb25GaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9yZWFjdGlvbkZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLG1EQUErQztBQUUvQyxNQUFNLGNBQWMsR0FBRztJQUNyQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM5QixHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1FBQ2hDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUMzRDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2FBQ25CO1lBQ0QsNEJBQVk7WUFDWjtnQkFDRSxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLFlBQVk7b0JBQ2xCLDBCQUEwQixFQUFFLElBQUk7aUJBQ2pDO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxXQUFXO0tBQ2hCO0NBQ0YsQ0FBQztBQWlJQSx3Q0FBYztBQS9IaEIsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM5QixHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1FBQ2hDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUMxRCxJQUFJLEVBQUUs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