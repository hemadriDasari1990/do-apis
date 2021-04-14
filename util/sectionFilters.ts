import Section from "../models/section";
import { notesLookup } from "./noteFilters";

const sectionsLookup = {
  $lookup: {
    from: Section.collection.name,
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
      notesLookup,
    ],
    as: "sections",
  },
};

const sectionAddFields = {
  $addFields: {
    sections: "$sections",
    totalSections: { $size: { $ifNull: ["$sections", []] } },
  },
};

export { sectionsLookup, sectionAddFields };
