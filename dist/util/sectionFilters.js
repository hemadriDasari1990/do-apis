"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionAddFields = exports.sectionsLookup = void 0;
const section_1 = __importDefault(require("../models/section"));
const noteFilters_1 = require("./noteFilters");
const sectionsLookup = {
    $lookup: {
        from: section_1.default.collection.name,
        let: { sections: "$sections" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$sections", []] }] },
                },
            },
            {
                $sort: { _id: 1 },
            },
            noteFilters_1.notesLookup,
        ],
        as: "sections",
    },
};
exports.sectionsLookup = sectionsLookup;
const sectionAddFields = {
    $addFields: {
        sections: "$sections",
        totalSections: { $size: { $ifNull: ["$sections", []] } },
    },
};
exports.sectionAddFields = sectionAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbkZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3NlY3Rpb25GaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdFQUF3QztBQUN4QywrQ0FBNEM7QUFFNUMsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGlCQUFPLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDN0IsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtRQUM5QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDMUQ7YUFDRjtZQUNEO2dCQUNFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7YUFDbEI7WUFDRCx5QkFBVztTQUNaO1FBQ0QsRUFBRSxFQUFFLFVBQVU7S0FDZjtDQUNGLENBQUM7QUFTTyx3Q0FBYztBQVB2QixNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLFVBQVUsRUFBRTtRQUNWLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ3pEO0NBQ0YsQ0FBQztBQUV1Qiw0Q0FBZ0IifQ==