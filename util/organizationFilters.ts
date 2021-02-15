import Department from '../models/Department';
import Project from '../models/Project';

const departmentsLookup = { "$lookup": {
  "from": Department.collection.name,
  "let": { "departments": "$departments" },
  "pipeline": [
    { "$match": {
      "$expr": { "$in": ["$_id", {$ifNull :['$$departments',[]]}] },
    }},
    {
      "$sort": {"_id": 1}
    },
    { "$lookup": {
      "from": Project.collection.name,
      "let": { "projects": "$projects" },
      "pipeline": [
        { "$match": {
          "$expr": { "$in": ["$_id", {$ifNull :['$$projects',[]]}] },
        }},
      ],
      "as": "projects"
    }},
    { "$addFields": {
      "totalProjects": { "$sum": { "$size": { "$ifNull": [ "$projects", [] ] }}},
    }},
  ],
  "as": "departments"
}}

const organizationAddFields = { "$addFields": {
  "departments": "$departments",
  "totalDepartments": { "$size": { "$ifNull": [ "$departments", 0 ] }},
}};

export { departmentsLookup, organizationAddFields };
