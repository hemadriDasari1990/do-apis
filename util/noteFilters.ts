import {
  reactionAddFields,
  reactionDeserveLookup,
  reactionDisAgreeLookup,
  reactionLookup,
  reactionLoveLookup,
  reactionPlusOneLookup,
  reactionPlusTwoLookup,
} from "./reactionFilters";

import Note from "../models/note";
import Section from "../models/section";
import Member from "../models/member";

const noteAddFields = {
  $addFields: {
    notes: "$notes",
    totalNotes: { $size: { $ifNull: ["$notes", []] } },
    section: { $ifNull: ["$section", [null]] },
    createdBy: { $ifNull: ["$createdBy", [null]] },
    updatedBy: { $ifNull: ["$updatedBy", [null]] },
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
      reactionDisAgreeLookup,
      reactionPlusTwoLookup,
      reactionPlusOneLookup,
      reactionDeserveLookup,
      reactionLoveLookup,
      reactionLookup,
      noteAddFields,
      reactionAddFields,
    ],
    as: "notes",
  },
};

export { noteAddFields, notesLookup, createdByLookUp, updatedByLookUp };
