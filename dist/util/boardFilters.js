"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardAddFields = exports.sectionsLookup = void 0;
const section_1 = __importDefault(require("../models/section"));
const sectionsLookup = { "$lookup": {
        "from": section_1.default.collection.name,
        "let": { "sections": "$sections" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$sections', []] }] },
                } },
            {
                "$sort": { "_id": 1 }
            },
        ],
        "as": "sections"
    } };
exports.sectionsLookup = sectionsLookup;
const boardAddFields = { "$addFields": {
        "sections": "$sections",
        "totalSections": { "$size": { "$ifNull": ["$sections", 0] } },
    } };
exports.boardAddFields = boardAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmRGaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9ib2FyZEZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQXdDO0FBRXhDLE1BQU0sY0FBYyxHQUFHLEVBQUUsU0FBUyxFQUFFO1FBQ2xDLE1BQU0sRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQy9CLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUU7UUFDbEMsVUFBVSxFQUFFO1lBQ1YsRUFBRSxRQUFRLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRTtpQkFDM0QsRUFBQztZQUNGO2dCQUNFLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUM7YUFDcEI7U0FDRjtRQUNELElBQUksRUFBRSxVQUFVO0tBQ2pCLEVBQUMsQ0FBQTtBQU9PLHdDQUFjO0FBTHZCLE1BQU0sY0FBYyxHQUFHLEVBQUUsWUFBWSxFQUFFO1FBQ3JDLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLGVBQWUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFFLFdBQVcsRUFBRSxDQUFDLENBQUUsRUFBRSxFQUFDO0tBQy9ELEVBQUMsQ0FBQztBQUVzQix3Q0FBYyJ9