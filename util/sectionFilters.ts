import {
  noteAddFields,
  reactionAgreeLookup,
  reactionDisAgreeLookup,
  reactionLookup,
  reactionLoveLookup
} from "./noteFilters";

import Note from '../models/note';

const sectionsLookup = { "$lookup": {
  "from": Note.collection.name,
  "let": { "notes": "$notes" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$notes',[]]}] },
    }},
    {
      "$sort": {"_id": -1}
    },
    reactionDisAgreeLookup,
    reactionAgreeLookup,
    reactionLoveLookup,
    reactionLookup,
    noteAddFields,
  ],
  "as": "notes"
}}

const sectionAddFields = { "$addFields": {
  "notes": "$notes",
  "totalNotes": { "$size": { "$ifNull": [ "$notes", 0 ] }},
}};

export { sectionsLookup, sectionAddFields };
