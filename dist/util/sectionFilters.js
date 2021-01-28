"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionAddFields = exports.sectionsLookup = void 0;
const noteFilters_1 = require("./noteFilters");
const note_1 = __importDefault(require("../models/note"));
const sectionsLookup = { "$lookup": {
        "from": note_1.default.collection.name,
        "let": { "notes": "$notes" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$notes', []] }] },
                } },
            {
                "$sort": { "_id": -1 }
            },
            noteFilters_1.reactionDisAgreeLookup,
            noteFilters_1.reactionAgreeLookup,
            noteFilters_1.reactionLoveLookup,
            noteFilters_1.reactionLookup,
            noteFilters_1.noteAddFields,
        ],
        "as": "notes"
    } };
exports.sectionsLookup = sectionsLookup;
const sectionAddFields = { "$addFields": {
        "notes": "$notes",
        "totalNotes": { "$size": { "$ifNull": ["$notes", 0] } },
    } };
exports.sectionAddFields = sectionAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbkZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3NlY3Rpb25GaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtDQU11QjtBQUV2QiwwREFBa0M7QUFFbEMsTUFBTSxjQUFjLEdBQUcsRUFBRSxTQUFTLEVBQUU7UUFDbEMsTUFBTSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM1QixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO1FBQzVCLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7aUJBQ3hELEVBQUM7WUFDRjtnQkFDRSxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUM7YUFDckI7WUFDRCxvQ0FBc0I7WUFDdEIsaUNBQW1CO1lBQ25CLGdDQUFrQjtZQUNsQiw0QkFBYztZQUNkLDJCQUFhO1NBQ2Q7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkLEVBQUMsQ0FBQTtBQU9PLHdDQUFjO0FBTHZCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxZQUFZLEVBQUU7UUFDdkMsT0FBTyxFQUFFLFFBQVE7UUFDakIsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsUUFBUSxFQUFFLENBQUMsQ0FBRSxFQUFFLEVBQUM7S0FDekQsRUFBQyxDQUFDO0FBRXNCLDRDQUFnQiJ9