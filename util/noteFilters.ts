import {
  reactionAddFields,
  reactionDeserveLookup,
  reactionLookup,
  reactionLoveLookup,
  reactionMinusOneLookup,
  reactionPlusOneLookup,
  reactionHighlightLookup,
} from "./reactionFilters";

import Member from "../models/member";
import Note from "../models/note";
import Section from "../models/section";

const noteAddFields = {
  $addFields: {
    notes: "$notes",
    totalNotes: { $size: { $ifNull: ["$notes", []] } },
    section: { $ifNull: ["$section", [null]] },
    createdBy: { $ifNull: ["$createdBy", [null]] },
    updatedBy: { $ifNull: ["$updatedBy", [null]] },
  },
};

const sectionNoteAddFields = {
  $addFields: {
    totalNotes: { $size: { $ifNull: ["$notes", []] } },
    notes: [],
  },
};

const createdByLookUp = {
  $lookup: {
    from: Member.collection.name,
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

const updatedByLookUp = {
  $lookup: {
    from: Member.collection.name,
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

const notesLookup = {
  $lookup: {
    from: Note.collection.name,
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
          from: Section.collection.name,
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
      reactionLookup,
      reactionMinusOneLookup,
      reactionHighlightLookup,
      reactionPlusOneLookup,
      reactionDeserveLookup,
      reactionLoveLookup,
      noteAddFields,
      reactionAddFields,
    ],
    as: "notes",
  },
};

export {
  noteAddFields,
  notesLookup,
  createdByLookUp,
  updatedByLookUp,
  sectionNoteAddFields,
};
