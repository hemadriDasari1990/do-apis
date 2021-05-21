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

const sectionsWithoutNoteLookup = {
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
    ],
    as: "sections",
  },
};

const sectionLookup = {
  $lookup: {
    from: Section.collection.name,
    let: { sectionId: "$sectionId" },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ["$_id", { $ifNull: ["$$sectionId", []] }] },
        },
      },
    ],
    as: "section",
  },
};

const sectionAddFields = {
  $addFields: {
    sections: "$sections",
    totalSections: { $size: { $ifNull: ["$sections", []] } },
    totalNotes: { $size: { $ifNull: ["$sections.notes", []] } },
  },
};

export {
  sectionsLookup,
  sectionAddFields,
  sectionLookup,
  sectionsWithoutNoteLookup,
};
