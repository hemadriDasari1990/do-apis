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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbkZpbHRlcnMgY29weS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWwvc2VjdGlvbkZpbHRlcnMgY29weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnRUFBd0M7QUFDeEMsK0NBQTRDO0FBRTVDLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzdCLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7UUFDOUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQzFEO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO2FBQ2xCO1lBQ0QseUJBQVc7U0FDWjtRQUNELEVBQUUsRUFBRSxVQUFVO0tBQ2Y7Q0FDRixDQUFDO0FBU08sd0NBQWM7QUFQdkIsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixVQUFVLEVBQUU7UUFDVixRQUFRLEVBQUUsV0FBVztRQUNyQixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUN6RDtDQUNGLENBQUM7QUFFdUIsNENBQWdCIn0=