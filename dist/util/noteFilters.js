"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesLookup = exports.noteAddFields = void 0;
const reactionFilters_1 = require("./reactionFilters");
const note_1 = __importDefault(require("../models/note"));
const section_1 = __importDefault(require("../models/section"));
const noteAddFields = {
    $addFields: {
        notes: "$notes",
        totalNotes: { $size: { $ifNull: ["$notes", []] } },
        section: { $ifNull: ["$section", [null]] },
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
                $sort: { _id: -1 },
            },
            {
                $lookup: {
                    from: section_1.default.collection.name,
                    let: { sectionId: "$sectionId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$sectionId"] },
                            },
                        },
                    ],
                    as: "section",
                },
            },
            { $unwind: "$section" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHVEQVEyQjtBQUUzQiwwREFBa0M7QUFDbEMsZ0VBQXdDO0FBRXhDLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLFVBQVUsRUFBRTtRQUNWLEtBQUssRUFBRSxRQUFRO1FBQ2YsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbEQsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtLQUMzQztDQUNGLENBQUM7QUEyQ08sc0NBQWE7QUF6Q3RCLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDdkQ7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRTthQUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSTtvQkFDN0IsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRTtvQkFDaEMsUUFBUSxFQUFFO3dCQUNSOzRCQUNFLE1BQU0sRUFBRTtnQ0FDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUU7NkJBQ3hDO3lCQUNGO3FCQUNGO29CQUNELEVBQUUsRUFBRSxTQUFTO2lCQUNkO2FBQ0Y7WUFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7WUFDdkIsd0NBQXNCO1lBQ3RCLHVDQUFxQjtZQUNyQix1Q0FBcUI7WUFDckIsdUNBQXFCO1lBQ3JCLG9DQUFrQjtZQUNsQixnQ0FBYztZQUNkLGFBQWE7WUFDYixtQ0FBaUI7U0FDbEI7UUFDRCxFQUFFLEVBQUUsT0FBTztLQUNaO0NBQ0YsQ0FBQztBQUVzQixrQ0FBVyJ9