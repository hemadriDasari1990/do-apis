import Reaction from '../models/reaction';

const reactionLookup = { "$lookup": {
  "from": Reaction.collection.name,
  "let": { "reactions": "$reactions" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$reactions',[]]}] },
    }},
    {
      "$sort": {"_id": -1}
    }
  ],
  "as": "reactions"
}}

const reactionAgreeLookup = { "$lookup": {
  "from": Reaction.collection.name,
  "let": { "reactions": "$reactions" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$reactions',[]]}] },
      "type": "agree"
    }}
  ],
  "as": "agreeReactions"
}}

const reactionDisAgreeLookup = { "$lookup": {
  "from": Reaction.collection.name,
  "let": { "reactions": "$reactions" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$reactions',[]]}] },
      "type": "disagree"
    }}
  ],
  "as": "disAgreeReactions"
}}

const reactionLoveLookup = { "$lookup": {
  "from": Reaction.collection.name,
  "let": { "reactions": "$reactions" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$reactions',[]]}] },
      "type": "love"
    }}
  ],
  "as": "loveReactions"
}}


const noteAddFields = { "$addFields": {
  "totalReactions": { "$size": { "$ifNull": [ "$reactions", [] ] }},
  "totalAgreed": { "$size": { "$ifNull": [ "$agreeReactions", [] ] }},
  "totalDisAgreed": { "$size": { "$ifNull": [ "$disAgreeReactions", [] ] }},
  "totalLove": { "$size": { "$ifNull": [ "$loveReactions", [] ] }},
}};

export { 
  noteAddFields,
  reactionLookup,
  reactionAgreeLookup,
  reactionDisAgreeLookup,
  reactionLoveLookup
};
