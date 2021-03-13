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

const noteAddFields = {
  $addFields: {
    notes: "$notes",
    totalNotes: { $size: { $ifNull: ["$notes", []] } },
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
        $sort: { _id: 1 },
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

export { noteAddFields, notesLookup };
