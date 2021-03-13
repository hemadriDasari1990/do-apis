"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesLookup = exports.noteAddFields = void 0;
const reactionFilters_1 = require("./reactionFilters");
const note_1 = __importDefault(require("../models/note"));
const noteAddFields = {
    $addFields: {
        notes: "$notes",
        totalNotes: { $size: { $ifNull: ["$notes", []] } },
    },
};
exports.noteAddFields = noteAddFields;
const notesLookup = {
    $lookup: {
        from: note_1.default.collection.name,
        let: { notes: "$notes" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$notes", []] }] },
                },
            },
            {
                $sort: { _id: 1 },
            },
            reactionFilters_1.reactionDisAgreeLookup,
            reactionFilters_1.reactionPlusTwoLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionLoveLookup,
            reactionFilters_1.reactionLookup,
            noteAddFields,
            reactionFilters_1.reactionAddFields,
        ],
        as: "notes",
    },
};
exports.notesLookup = notesLookup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHVEQVEyQjtBQUUzQiwwREFBa0M7QUFFbEMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFLFFBQVE7UUFDZixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNuRDtDQUNGLENBQUM7QUE0Qk8sc0NBQWE7QUExQnRCLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDdkQ7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7YUFDbEI7WUFDRCx3Q0FBc0I7WUFDdEIsdUNBQXFCO1lBQ3JCLHVDQUFxQjtZQUNyQix1Q0FBcUI7WUFDckIsb0NBQWtCO1lBQ2xCLGdDQUFjO1lBQ2QsYUFBYTtZQUNiLG1DQUFpQjtTQUNsQjtRQUNELEVBQUUsRUFBRSxPQUFPO0tBQ1o7Q0FDRixDQUFDO0FBRXNCLGtDQUFXIn0=