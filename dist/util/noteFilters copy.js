"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionNoteAddFields = exports.updatedByLookUp = exports.createdByLookUp = exports.notesLookup = exports.noteAddFields = void 0;
const reactionFilters_1 = require("./reactionFilters");
const member_1 = __importDefault(require("../models/member"));
const note_1 = __importDefault(require("../models/note"));
const section_1 = __importDefault(require("../models/section"));
const noteAddFields = {
    $addFields: {
        notes: "$notes",
        totalNotes: { $size: { $ifNull: ["$notes", []] } },
        section: { $ifNull: ["$section", [null]] },
        createdBy: { $ifNull: ["$createdBy", [null]] },
        updatedBy: { $ifNull: ["$updatedBy", [null]] },
    },
};
exports.noteAddFields = noteAddFields;
const sectionNoteAddFields = {
    $addFields: {
        totalNotes: { $size: { $ifNull: ["$notes", []] } },
        notes: [],
    },
};
exports.sectionNoteAddFields = sectionNoteAddFields;
const createdByLookUp = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { createdById: "$createdById" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", { $ifNull: ["$$createdById", []] }] },
                },
            },
        ],
        as: "createdBy",
    },
};
exports.createdByLookUp = createdByLookUp;
const updatedByLookUp = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { updatedById: "$updatedById" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", { $ifNull: ["$$updatedById", []] }] },
                },
            },
        ],
        as: "updatedBy",
    },
};
exports.updatedByLookUp = updatedByLookUp;
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
            {
                $unwind: {
                    path: "$section",
                    preserveNullAndEmptyArrays: true,
                },
            },
            reactionFilters_1.reactionLookup,
            reactionFilters_1.reactionMinusOneLookup,
            reactionFilters_1.reactionHighlightLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionLoveLookup,
            noteAddFields,
            reactionFilters_1.reactionAddFields,
        ],
        as: "notes",
    },
};
exports.notesLookup = notesLookup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMgY29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWwvbm90ZUZpbHRlcnMgY29weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1REFRMkI7QUFFM0IsOERBQXNDO0FBQ3RDLDBEQUFrQztBQUNsQyxnRUFBd0M7QUFFeEMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsVUFBVSxFQUFFO1FBQ1YsS0FBSyxFQUFFLFFBQVE7UUFDZixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRCxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQzFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDOUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtLQUMvQztDQUNGLENBQUM7QUFzRkEsc0NBQWE7QUFwRmYsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixVQUFVLEVBQUU7UUFDVixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRCxLQUFLLEVBQUUsRUFBRTtLQUNWO0NBQ0YsQ0FBQztBQW1GQSxvREFBb0I7QUFqRnRCLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzVCLEdBQUcsRUFBRSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUU7UUFDcEMsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQzdEO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxXQUFXO0tBQ2hCO0NBQ0YsQ0FBQztBQWtFQSwwQ0FBZTtBQWhFakIsTUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGdCQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDNUIsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtRQUNwQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDN0Q7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFdBQVc7S0FDaEI7Q0FDRixDQUFDO0FBb0RBLDBDQUFlO0FBbERqQixNQUFNLFdBQVcsR0FBRztJQUNsQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsY0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzFCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDeEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQ3ZEO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUU7YUFDbkI7WUFDRDtnQkFDRSxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUk7b0JBQzdCLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7b0JBQ2hDLFFBQVEsRUFBRTt3QkFDUjs0QkFDRSxNQUFNLEVBQUU7Z0NBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxFQUFFOzZCQUN4Qzt5QkFDRjtxQkFDRjtvQkFDRCxFQUFFLEVBQUUsU0FBUztpQkFDZDthQUNGO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxVQUFVO29CQUNoQiwwQkFBMEIsRUFBRSxJQUFJO2lCQUNqQzthQUNGO1lBQ0QsZ0NBQWM7WUFDZCx3Q0FBc0I7WUFDdEIseUNBQXVCO1lBQ3ZCLHVDQUFxQjtZQUNyQix1Q0FBcUI7WUFDckIsb0NBQWtCO1lBQ2xCLGFBQWE7WUFDYixtQ0FBaUI7U0FDbEI7UUFDRCxFQUFFLEVBQUUsT0FBTztLQUNaO0NBQ0YsQ0FBQztBQUlBLGtDQUFXIn0=