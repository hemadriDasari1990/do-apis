import Board from '../models/board';
import Section from '../models/section';

const projectsLookup = { "$lookup": {
    "from": Board.collection.name,
    "let": { "boards": "$boards" },
    "pipeline": [
      { "$match": {
        "$expr": { "$in": ["$_id", {$ifNull :['$$boards',[]]}] },
      }},
      {
        "$sort": {"_id": 1}
      },
      { "$lookup": {
        "from": Section.collection.name,
        "let": { "sections": "$sections" },
        "pipeline": [
          { "$match": {
            "$expr": { "$in": ["$_id", {$ifNull :['$$sections',[]]}] },
          }},
        ],
        "as": "sections"
      }},
      { "$addFields": {
        "totalSections": { "$sum": { "$size": { "$ifNull": [ "$sections", [] ] }}},
      }},
    ],
    "as": "boards"
  }}
  
  const projectAddFields = { "$addFields": {
    "boards": "$boards",
    "totalBoards": { "$size": { "$ifNull": [ "$boards", 0 ] }},
  }};
  
  export { projectsLookup, projectAddFields };
  