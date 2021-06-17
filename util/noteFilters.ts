import {
  reactionAddFields,
  reactionAgreeLookup,
  reactionDeserveLookup,
  reactionDisagreeLookup,
  reactionHighlightLookup,
  reactionLookup,
  reactionLoveLookup,
} from "./reactionFilters";

import JoinMember from "../models/join";
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
    from: JoinMember.collection.name,
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
    from: JoinMember.collection.name,
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
      reactionDisagreeLookup,
      reactionHighlightLookup,
      reactionAgreeLookup,
      reactionDeserveLookup,
      reactionLoveLookup,
      reactionLookup,
      createdByLookUp,
      updatedByLookUp,
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$updatedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
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
