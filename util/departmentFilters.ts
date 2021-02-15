import Board from '../models/board';
import Project from '../models/project';

const departmentsLookup = { "$lookup": {
    "from": Project.collection.name,
    "let": { "projects": "$projects" },
    "pipeline": [
      { "$match": {
        "$expr": { "$in": ["$_id", {$ifNull :['$$projects',[]]}] },
      }},
      {
        "$sort": {"_id": 1}
      },
      { "$lookup": {
        "from": Board.collection.name,
        "let": { "boards": "$boards" },
        "pipeline": [
          { "$match": {
            "$expr": { "$in": ["$_id", {$ifNull :['$$boards',[]]}] },
          }},
        ],
        "as": "boards"
      }},
      { "$addFields": {
        "totalBoards": { "$sum": { "$size": { "$ifNull": [ "$boards", [] ] }}},
      }},
    ],
    "as": "projects"
  }}
  
  const departmentAddFields = { "$addFields": {
    "projects": "$projects",
    "totalProjects": { "$size": { "$ifNull": [ "$projects", 0 ] }},
  }};
  
  export { departmentsLookup, departmentAddFields };
  