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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHVEQVEyQjtBQUUzQiw4REFBc0M7QUFDdEMsMERBQWtDO0FBQ2xDLGdFQUF3QztBQUV4QyxNQUFNLGFBQWEsR0FBRztJQUNwQixVQUFVLEVBQUU7UUFDVixLQUFLLEVBQUUsUUFBUTtRQUNmLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xELE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDMUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUM5QyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0tBQy9DO0NBQ0YsQ0FBQztBQXNGQSxzQ0FBYTtBQXBGZixNQUFNLG9CQUFvQixHQUFHO0lBQzNCLFVBQVUsRUFBRTtRQUNWLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xELEtBQUssRUFBRSxFQUFFO0tBQ1Y7Q0FDRixDQUFDO0FBbUZBLG9EQUFvQjtBQWpGdEIsTUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGdCQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDNUIsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtRQUNwQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDN0Q7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFdBQVc7S0FDaEI7Q0FDRixDQUFDO0FBa0VBLDBDQUFlO0FBaEVqQixNQUFNLGVBQWUsR0FBRztJQUN0QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM1QixHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO1FBQ3BDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUM3RDthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsV0FBVztLQUNoQjtDQUNGLENBQUM7QUFvREEsMENBQWU7QUFsRGpCLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDdkQ7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRTthQUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSTtvQkFDN0IsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRTtvQkFDaEMsUUFBUSxFQUFFO3dCQUNSOzRCQUNFLE1BQU0sRUFBRTtnQ0FDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLEVBQUU7NkJBQ3hDO3lCQUNGO3FCQUNGO29CQUNELEVBQUUsRUFBRSxTQUFTO2lCQUNkO2FBQ0Y7WUFDRDtnQkFDRSxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLDBCQUEwQixFQUFFLElBQUk7aUJBQ2pDO2FBQ0Y7WUFDRCxnQ0FBYztZQUNkLHdDQUFzQjtZQUN0Qix5Q0FBdUI7WUFDdkIsdUNBQXFCO1lBQ3JCLHVDQUFxQjtZQUNyQixvQ0FBa0I7WUFDbEIsYUFBYTtZQUNiLG1DQUFpQjtTQUNsQjtRQUNELEVBQUUsRUFBRSxPQUFPO0tBQ1o7Q0FDRixDQUFDO0FBSUEsa0NBQVcifQ==