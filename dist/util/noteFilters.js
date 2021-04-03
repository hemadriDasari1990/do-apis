"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedByLookUp = exports.createdByLookUp = exports.notesLookup = exports.noteAddFields = void 0;
const reactionFilters_1 = require("./reactionFilters");
const note_1 = __importDefault(require("../models/note"));
const section_1 = __importDefault(require("../models/section"));
const member_1 = __importDefault(require("../models/member"));
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
            reactionFilters_1.reactionMinusOneLookup,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL25vdGVGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHVEQVEyQjtBQUUzQiwwREFBa0M7QUFDbEMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUV0QyxNQUFNLGFBQWEsR0FBRztJQUNwQixVQUFVLEVBQUU7UUFDVixLQUFLLEVBQUUsUUFBUTtRQUNmLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xELE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDMUMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUM5QyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0tBQy9DO0NBQ0YsQ0FBQztBQThFTyxzQ0FBYTtBQTVFdEIsTUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGdCQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDNUIsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtRQUNwQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDN0Q7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFdBQVc7S0FDaEI7Q0FDRixDQUFDO0FBK0RtQywwQ0FBZTtBQTdEcEQsTUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGdCQUFNLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDNUIsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtRQUNwQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDN0Q7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFdBQVc7S0FDaEI7Q0FDRixDQUFDO0FBZ0RvRCwwQ0FBZTtBQTlDckUsTUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMxQixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO2FBQ25CO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO29CQUM3QixHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO29CQUNoQyxRQUFRLEVBQUU7d0JBQ1I7NEJBQ0UsTUFBTSxFQUFFO2dDQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsRUFBRTs2QkFDeEM7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsRUFBRSxFQUFFLFNBQVM7aUJBQ2Q7YUFDRjtZQUNEO2dCQUNFLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsVUFBVTtvQkFDaEIsMEJBQTBCLEVBQUUsSUFBSTtpQkFDakM7YUFDRjtZQUNELHdDQUFzQjtZQUN0Qix1Q0FBcUI7WUFDckIsdUNBQXFCO1lBQ3JCLHVDQUFxQjtZQUNyQixvQ0FBa0I7WUFDbEIsZ0NBQWM7WUFDZCxhQUFhO1lBQ2IsbUNBQWlCO1NBQ2xCO1FBQ0QsRUFBRSxFQUFFLE9BQU87S0FDWjtDQUNGLENBQUM7QUFFc0Isa0NBQVcifQ==