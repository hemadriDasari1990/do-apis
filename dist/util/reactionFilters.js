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
                $sort: { _id: 1 },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Rpb25GaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9yZWFjdGlvbkZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0VBQTBDO0FBRTFDLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzlCLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7UUFDaEMsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQzNEO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO2FBQ2xCO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsV0FBVztLQUNoQjtDQUNGLENBQUM7QUE4RkEsd0NBQWM7QUE1RmhCLE1BQU0scUJBQXFCLEdBQUc7SUFDNUIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGtCQUFRLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDOUIsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRTtRQUNoQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDMUQsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxrQkFBa0I7S0FDdkI7Q0FDRixDQUFDO0FBK0VBLHNEQUFxQjtBQTdFdkIsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixPQUFP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