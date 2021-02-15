"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentAddFields = exports.departmentsLookup = void 0;
const board_1 = __importDefault(require("../models/board"));
const project_1 = __importDefault(require("../models/project"));
const departmentsLookup = { "$lookup": {
        "from": project_1.default.collection.name,
        "let": { "projects": "$projects" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$projects', []] }] },
                } },
            {
                "$sort": { "_id": 1 }
            },
            { "$lookup": {
                    "from": board_1.default.collection.name,
                    "let": { "boards": "$boards" },
                    "pipeline": [
                        { "$match": {
                                "$expr": { "$in": ["$_id", { $ifNull: ['$$boards', []] }] },
                            } },
                    ],
                    "as": "boards"
                } },
            { "$addFields": {
                    "totalBoards": { "$sum": { "$size": { "$ifNull": ["$boards", []] } } },
                } },
        ],
        "as": "projects"
    } };
exports.departmentsLookup = departmentsLookup;
const departmentAddFields = { "$addFields": {
        "projects": "$projects",
        "totalProjects": { "$size": { "$ifNull": ["$projects", 0] } },
    } };
exports.departmentAddFields = departmentAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0bWVudEZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2RlcGFydG1lbnRGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUFvQztBQUNwQyxnRUFBd0M7QUFFeEMsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLFNBQVMsRUFBRTtRQUNuQyxNQUFNLEVBQUUsaUJBQU8sQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMvQixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO1FBQ2xDLFVBQVUsRUFBRTtZQUNWLEVBQUUsUUFBUSxFQUFFO29CQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7aUJBQzNELEVBQUM7WUFDRjtnQkFDRSxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO2FBQ3BCO1lBQ0QsRUFBRSxTQUFTLEVBQUU7b0JBQ1gsTUFBTSxFQUFFLGVBQUssQ0FBQyxVQUFVLENBQUMsSUFBSTtvQkFDN0IsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRTtvQkFDOUIsVUFBVSxFQUFFO3dCQUNWLEVBQUUsUUFBUSxFQUFFO2dDQUNWLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUU7NkJBQ3pELEVBQUM7cUJBQ0g7b0JBQ0QsSUFBSSxFQUFFLFFBQVE7aUJBQ2YsRUFBQztZQUNGLEVBQUUsWUFBWSxFQUFFO29CQUNkLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFFLFNBQVMsRUFBRSxFQUFFLENBQUUsRUFBRSxFQUFDLEVBQUM7aUJBQ3ZFLEVBQUM7U0FDSDtRQUNELElBQUksRUFBRSxVQUFVO0tBQ2pCLEVBQUMsQ0FBQTtBQU9PLDhDQUFpQjtBQUwxQixNQUFNLG1CQUFtQixHQUFHLEVBQUUsWUFBWSxFQUFFO1FBQzFDLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLGVBQWUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFFLFdBQVcsRUFBRSxDQUFDLENBQUUsRUFBRSxFQUFDO0tBQy9ELEVBQUMsQ0FBQztBQUV5QixrREFBbUIifQ==