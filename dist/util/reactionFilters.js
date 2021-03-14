"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionAddFields = exports.reactionLoveLookup = exports.reactionDisAgreeLookup = exports.reactionDeserveLookup = exports.reactionPlusTwoLookup = exports.reactionPlusOneLookup = exports.reactionLookup = void 0;
const reaction_1 = __importDefault(require("../models/reaction"));
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
        ],
        as: "deserveReactions",
    },
};
exports.reactionDeserveLookup = reactionDeserveLookup;
const reactionDisAgreeLookup = {
    $lookup: {
        from: reaction_1.default.collection.name,
        let: { reactions: "$reactions" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$reactions", []] }] },
                    type: "disagree",
                },
            },
        ],
        as: "disAgreeReactions",
    },
};
exports.reactionDisAgreeLookup = reactionDisAgreeLookup;
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
        totalDisAgreed: { $size: { $ifNull: ["$disAgreeReactions", []] } },
        totalLove: { $size: { $ifNull: ["$loveReactions", []] } },
    },
};
exports.reactionAddFields = reactionAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Rpb25GaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9yZWFjdGlvbkZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0VBQTBDO0FBRTFDLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzlCLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7UUFDaEMsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQzNEO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUU7YUFDbkI7U0FDRjtRQUNELEVBQUUsRUFBRSxXQUFXO0tBQ2hCO0NBQ0YsQ0FBQztBQThGQSx3Q0FBYztBQTVGaEIsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM5QixHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1FBQ2hDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUMxRCxJQUFJLEVBQUUsU0FBUztpQkFDaEI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLGtCQUFrQjtLQUN2QjtDQUNGLENBQUM7QUErRUEsc0RBQXFCO0FBN0V2QixNQUFNLHFCQUFxQixHQUFHO0lBQzVC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