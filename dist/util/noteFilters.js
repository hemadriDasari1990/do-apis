"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionLoveLookup = exports.reactionDisAgreeLookup = exports.reactionAgreeLookup = exports.reactionLookup = exports.noteAddFields = void 0;
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
const reactionAgreeLookup = { "$lookup": {
        "from": reaction_1.default.collection.name,
        "let": { "reactions": "$reactions" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$reactions', []] }] },
                    "type": "agree"
                } }
        ],
        "as": "agreeReactions"
    } };
exports.reactionAgreeLookup = reactionAgreeLookup;
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
        "totalAgreed": { "$size": { "$ifNull": ["$agreeReactions", []] } },
        "totalDisAgreed": { "$size": { "$ifNull": ["$disAgreeReactions", []] } },
        "totalLove": { "$size": { "$ifNull": ["$loveReactions", []] } },
    } };
exports.noteAddFields = noteAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGtFQUEwQztBQUUxQyxNQUFNLGNBQWMsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUNsQyxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFO1FBQ3BDLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7aUJBQzVELEVBQUM7WUFDRjtnQkFDRSxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUM7YUFDckI7U0FDRjtRQUNELElBQUksRUFBRSxXQUFXO0tBQ2xCLEVBQUMsQ0FBQTtBQWdEQSx3Q0FBYztBQTlDaEIsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUN2QyxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFO1FBQ3BDLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7b0JBQzNELE1BQU0sRUFBRSxPQUFPO2lCQUNoQixFQUFDO1NBQ0g7UUFDRCxJQUFJLEVBQUUsZ0JBQWdCO0tBQ3ZCLEVBQUMsQ0FBQTtBQXFDQSxrREFBbUI7QUFuQ3JCLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxTQUFTLEVBQUU7UUFDMUMsTUFBTSxFQUFFLGtCQUFRLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDaEMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRTtRQUNwQyxVQUFVLEVBQUU7WUFDVixFQUFFLFFBQVEsRUFBRTtvQkFDVixPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFO29CQUMzRCxNQUFNLEVBQUUsVUFBVTtpQkFDbkIsRUFBQztTQUNIO1FBQ0QsSUFBSSxFQUFFLG1CQUFtQjtLQUMxQixFQUFDLENBQUE7QUEwQkEsd0RBQXNCO0FBeEJ4QixNQUFNLGtCQUFrQixHQUFHLEVBQUUsU0FBUyxFQUFFO1FBQ3RDLE1BQU0sRUFBRSxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQ2hDLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUU7UUFDcEMsVUFBVSxFQUFFO1lBQ1YsRUFBRSxRQUFRLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRTtvQkFDM0QsTUFBTSxFQUFFLE1BQU07aUJBQ2YsRUFBQztTQUNIO1FBQ0QsSUFBSSxFQUFFLGVBQWU7S0FDdEIsRUFBQyxDQUFBO0FBZUEsZ0RBQWtCO0FBWnBCLE1BQU0sYUFBYSxHQUFHLEVBQUUsWUFBWSxFQUFFO1FBQ3BDLGdCQUFnQixFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBRSxFQUFFLEVBQUM7UUFDakUsYUFBYSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsaUJBQWlCLEVBQUUsRUFBRSxDQUFFLEVBQUUsRUFBQztRQUNuRSxnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFFLG9CQUFvQixFQUFFLEVBQUUsQ0FBRSxFQUFFLEVBQUM7UUFDekUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsZ0JBQWdCLEVBQUUsRUFBRSxDQUFFLEVBQUUsRUFBQztLQUNqRSxFQUFDLENBQUM7QUFHRCxzQ0FBYSJ9