"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionLoveLookup = exports.reactionDisAgreeLookup = exports.reactionDeserveLookup = exports.reactionPlusTwoLookup = exports.reactionPlusOneLookup = exports.reactionLookup = exports.noteAddFields = void 0;
const reaction_1 = __importDefault(require("../models/reaction"));
const reactionLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                } },
            {
                "$sort": { "_id": -1 }
            }
        ],
        "as": "reactions"
    } };
exports.reactionLookup = reactionLookup;
const reactionPlusOneLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                    "type": "plusOne"
                } }
        ],
        "as": "plusOneReactions"
    } };
exports.reactionPlusOneLookup = reactionPlusOneLookup;
const reactionPlusTwoLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                    "type": "plusTwo"
                } }
        ],
        "as": "plusTwoReactions"
    } };
exports.reactionPlusTwoLookup = reactionPlusTwoLookup;
const reactionDeserveLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                    "type": "deserve"
                } }
        ],
        "as": "deserveReactions"
    } };
exports.reactionDeserveLookup = reactionDeserveLookup;
const reactionDisAgreeLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                    "type": "disagree"
                } }
        ],
        "as": "disAgreeReactions"
    } };
exports.reactionDisAgreeLookup = reactionDisAgreeLookup;
const reactionLoveLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                    "type": "love"
                } }
        ],
        "as": "loveReactions"
    } };
exports.reactionLoveLookup = reactionLoveLookup;
const noteAddFields = { "$addFields": {
        "totalReactions": { "$size": { "$ifNull": ["$reactions", []] } },
        "totalPlusOne": { "$size": { "$ifNull": ["$plusOneReactions", []] } },
        "totalPlusTwo": { "$size": { "$ifNull": ["$plusTwoReactions", []] } },
        "totalDeserve": { "$size": { "$ifNull": ["$deserveReactions", []] } },
        "totalDisAgreed": { "$size": { "$ifNull": ["$disAgreeReactions", []] } },
        "totalLove": { "$size": { "$ifNull": ["$loveReactions", []] } },
    } };
exports.noteAddFields = noteAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGtFQUEwQztBQUUxQyxNQUFNLGNBQWMsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUNsQyxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFO1FBQ3BDLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7aUJBQzVELEVBQUM7WUFDRjtnQkFDRSxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUM7YUFDckI7U0FDRjtRQUNELElBQUksRUFBRSxXQUFXO0tBQ2xCLEVBQUMsQ0FBQTtBQTBFQSx3Q0FBYztBQXhFaEIsTUFBTSxxQkFBcUIsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUN6QyxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFO1FBQ3BDLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7b0JBQzNELE1BQU0sRUFBRSxTQUFTO2lCQUNsQixFQUFDO1NBQ0g7UUFDRCxJQUFJLEVBQUUsa0JBQWtCO0tBQ3pCLEVBQUMsQ0FBQTtBQStEQSxzREFBcUI7QUE3RHZCLE1BQU0scUJBQXFCLEdBQUcsRUFBRSxTQUFTLEVBQUU7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