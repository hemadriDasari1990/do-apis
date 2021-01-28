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
                "$sort": { "_id": -1 }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmRGaWx0ZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdXRpbC9ib2FyZEZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0VBQXdDO0FBRXhDLE1BQU0sY0FBYyxHQUFHLEVBQUUsU0FBUyxFQUFFO1FBQ2xDLE1BQU0sRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQy9CLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUU7UUFDbEMsVUFBVSxFQUFFO1lBQ1YsRUFBRSxRQUFRLEVBQUU7b0JBQ1YsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRTtpQkFDM0QsRUFBQztZQUNGO2dCQUNFLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBQzthQUNyQjtTQUNGO1FBQ0QsSUFBSSxFQUFFLFVBQVU7S0FDakIsRUFBQyxDQUFBO0FBT08sd0NBQWM7QUFMdkIsTUFBTSxjQUFjLEdBQUcsRUFBRSxZQUFZLEVBQUU7UUFDckMsVUFBVSxFQUFFLFdBQVc7UUFDdkIsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsV0FBVyxFQUFFLENBQUMsQ0FBRSxFQUFFLEVBQUM7S0FDL0QsRUFBQyxDQUFDO0FBRXNCLHdDQUFjIn0=