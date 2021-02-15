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
                "$sort": { "_id": 1 }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGtFQUEwQztBQUUxQyxNQUFNLGNBQWMsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUNsQyxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFO1FBQ3BDLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7aUJBQzVELEVBQUM7WUFDRjtnQkFDRSxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO2FBQ3BCO1NBQ0Y7UUFDRCxJQUFJLEVBQUUsV0FBVztLQUNsQixFQUFDLENBQUE7QUEwRUEsd0NBQWM7QUF4RWhCLE1BQU0scUJBQXFCLEdBQUcsRUFBRSxTQUFTLEVBQUU7UUFDekMsTUFBTSxFQUFFLGtCQUFRLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDaEMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRTtRQUNwQyxVQUFVLEVBQUU7WUFDVixFQUFFLFFBQVEsRUFBRTtvQkFDVixPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFO29CQUMzRCxNQUFNLEVBQUUsU0FBUztpQkFDbEIsRUFBQztTQUNIO1FBQ0QsSUFBSSxFQUFFLGtCQUFrQjtLQUN6QixFQUFDLENBQUE7QUErREEsc0RBQXFCO0FBN0R2QixNQUFNLHFCQUFxQixHQUFHLEVBQUUsU0FBUyxFQUFFO1FBQ3pD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