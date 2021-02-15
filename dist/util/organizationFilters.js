"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationAddFields = exports.departmentsLookup = void 0;
const Department_1 = __importDefault(require("../models/Department"));
const Project_1 = __importDefault(require("../models/Project"));
const departmentsLookup = { "$lookup": {
        "from": Department_1.default.collection.name,
        "let": { "departments": "$departments" },
        "pipeline": [
            { "$match": {
                    "$expr": { "$in": ["$_id", { $ifNull: ['$$departments', []] }] },
                } },
            {
                "$sort": { "_id": 1 }
            },
            { "$lookup": {
                    "from": Project_1.default.collection.name,
                    "let": { "projects": "$projects" },
                    "pipeline": [
                        { "$match": {
                                "$expr": { "$in": ["$_id", { $ifNull: ['$$projects', []] }] },
                            } },
                    ],
                    "as": "projects"
                } },
            { "$addFields": {
                    "totalProjects": { "$sum": { "$size": { "$ifNull": ["$projects", []] } } },
                } },
        ],
        "as": "departments"
    } };
exports.departmentsLookup = departmentsLookup;
const organizationAddFields = { "$addFields": {
        "departments": "$departments",
        "totalDepartments": { "$size": { "$ifNull": ["$departments", 0] } },
    } };
exports.organizationAddFields = organizationAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uRmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWwvb3JnYW5pemF0aW9uRmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzRUFBOEM7QUFDOUMsZ0VBQXdDO0FBRXhDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxTQUFTLEVBQUU7UUFDckMsTUFBTSxFQUFFLG9CQUFVLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDbEMsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRTtRQUN4QyxVQUFVLEVBQUU7WUFDVixFQUFFLFFBQVEsRUFBRTtvQkFDVixPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFO2lCQUM5RCxFQUFDO1lBQ0Y7Z0JBQ0UsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQzthQUNwQjtZQUNELEVBQUUsU0FBUyxFQUFFO29CQUNYLE1BQU0sRUFBRSxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJO29CQUMvQixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFO29CQUNsQyxVQUFVLEVBQUU7d0JBQ1YsRUFBRSxRQUFRLEVBQUU7Z0NBQ1YsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRTs2QkFDM0QsRUFBQztxQkFDSDtvQkFDRCxJQUFJLEVBQUUsVUFBVTtpQkFDakIsRUFBQztZQUNGLEVBQUUsWUFBWSxFQUFFO29CQUNkLGVBQWUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFFLFdBQVcsRUFBRSxFQUFFLENBQUUsRUFBRSxFQUFDLEVBQUM7aUJBQzNFLEVBQUM7U0FDSDtRQUNELElBQUksRUFBRSxhQUFhO0tBQ3BCLEVBQUMsQ0FBQTtBQU9PLDhDQUFpQjtBQUwxQixNQUFNLHFCQUFxQixHQUFHLEVBQUUsWUFBWSxFQUFFO1FBQzVDLGFBQWEsRUFBRSxjQUFjO1FBQzdCLGtCQUFrQixFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsY0FBYyxFQUFFLENBQUMsQ0FBRSxFQUFFLEVBQUM7S0FDckUsRUFBQyxDQUFDO0FBRXlCLHNEQUFxQiJ9