import Like from '../models/like';

const notesLookup = { "$lookup": {
  "from": Like.collection.name,
  "let": { "likes": "$likes" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$likes',[]]}] },
    }},
    {
      "$sort": {"_id": -1}
    },
  ],
  "as": "likes"
}}

const noteAddFields = { "$addFields": {
  "totalLikes": { "$size": { "$ifNull": [ "$likes", 0 ] }},
}};

export { notesLookup, noteAddFields };
