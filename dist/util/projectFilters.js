"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectAddFields = exports.projectsLookup = void 0;
const board_1 = __importDefault(require("../models/board"));
const section_1 = __importDefault(require("../models/section"));
const projectsLookup = { "$lookup": {
        "from": board_1.default.collection.name,
        "let": { "boards": "$boards" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$boards', []] }] },
                } },
            {
                "$sort": { "_id": 1 }
            },
            { "$lookup": {
                    "from": section_1.default.collection.name,
                    "let": { "sections": "$sections" },
                    "pipeline": [
                        { "$match": {
                                "$expr": { "$in": ["$_id", { $ifNull: ['$$sections', []] }] },
                            } },
                    ],
                    "as": "sections"
                } },
            { "$addFields": {
                    "totalSections": { "$sum": { "$size": { "$ifNull": ["$sections", []] } } },
                } },
        ],
        "as": "boards"
    } };
exports.projectsLookup = projectsLookup;
const projectAddFields = { "$addFields": {
        "boards": "$boards",
        "totalBoards": { "$size": { "$ifNull": ["$boards", 0] } },
    } };
exports.projectAddFields = projectAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdEZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3Byb2plY3RGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFvQztBQUNwQyxnRUFBd0M7QUFFeEMsTUFBTSxjQUFjLEdBQUcsRUFBRSxTQUFTLEVBQUU7UUFDaEMsTUFBTSxFQUFFLGVBQUssQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM3QixLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO1FBQzlCLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7aUJBQ3pELEVBQUM7WUFDRjtnQkFDRSxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO2FBQ3BCO1lBQ0QsRUFBRSxTQUFTLEVBQUU7b0JBQ1gsTUFBTSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUk7b0JBQy9CLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUU7b0JBQ2xDLFVBQVUsRUFBRTt3QkFDVixFQUFFLFFBQVEsRUFBRTtnQ0FDVixPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFOzZCQUMzRCxFQUFDO3FCQUNIO29CQUNELElBQUksRUFBRSxVQUFVO2lCQUNqQixFQUFDO1lBQ0YsRUFBRSxZQUFZLEVBQUU7b0JBQ2QsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBRSxFQUFFLEVBQUMsRUFBQztpQkFDM0UsRUFBQztTQUNIO1FBQ0QsSUFBSSxFQUFFLFFBQVE7S0FDZixFQUFDLENBQUE7QUFPTyx3Q0FBYztBQUx2QixNQUFNLGdCQUFnQixHQUFHLEVBQUUsWUFBWSxFQUFFO1FBQ3ZDLFFBQVEsRUFBRSxTQUFTO1FBQ25CLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFFLFNBQVMsRUFBRSxDQUFDLENBQUUsRUFBRSxFQUFDO0tBQzNELEVBQUMsQ0FBQztBQUVzQiw0Q0FBZ0IifQ==