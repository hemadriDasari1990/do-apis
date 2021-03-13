"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeDepartmentsLookup = exports.inActiveDepartmentsLookup = exports.departmentAddFields = exports.departmentsLookup = void 0;
const projectFilters_1 = require("./projectFilters");
const department_1 = __importDefault(require("../models/department"));
const departmentsLookup = {
    $lookup: {
        from: department_1.default.collection.name,
        let: { departments: "$departments" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$departments", []] }] },
                },
            },
            {
                $sort: { _id: 1 },
            },
            projectFilters_1.projectsLookup,
            projectFilters_1.activeProjectsLookup,
            projectFilters_1.inActiveProjectsLookup,
            projectFilters_1.privateProjectsLookup,
            projectFilters_1.publicProjectsLookup,
            projectFilters_1.projectAddFields,
        ],
        as: "departments",
    },
};
exports.departmentsLookup = departmentsLookup;
const inActiveDepartmentsLookup = {
    $lookup: {
        from: department_1.default.collection.name,
        let: { departments: "$departments" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$departments", []] }] },
                    status: "inactive",
                },
            },
        ],
        as: "inActiveDepartments",
    },
};
exports.inActiveDepartmentsLookup = inActiveDepartmentsLookup;
const activeDepartmentsLookup = {
    $lookup: {
        from: department_1.default.collection.name,
        let: { departments: "$departments" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$departments", []] }] },
                    status: "active",
                },
            },
        ],
        as: "activeDepartments",
    },
};
exports.activeDepartmentsLookup = activeDepartmentsLookup;
const departmentAddFields = {
    $addFields: {
        departments: "$departments",
    },
};
exports.departmentAddFields = departmentAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0bWVudEZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2RlcGFydG1lbnRGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFEQU8wQjtBQUUxQixzRUFBOEM7QUFFOUMsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO1FBQ3BDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUM3RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtZQUNELCtCQUFjO1lBQ2QscUNBQW9CO1lBQ3BCLHVDQUFzQjtZQUN0QixzQ0FBcUI7WUFDckIscUNBQW9CO1lBQ3BCLGlDQUFnQjtTQUNqQjtRQUNELEVBQUUsRUFBRSxhQUFhO0tBQ2xCO0NBQ0YsQ0FBQztBQWdEQSw4Q0FBaUI7QUE5Q25CLE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLG9CQUFVLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDaEMsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtRQUNwQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDNUQsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxxQkFBcUI7S0FDMUI7Q0FDRixDQUFDO0FBa0NBLDhEQUF5QjtBQWhDM0IsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO1FBQ3BDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUM1RCxNQUFNLEVBQUUsUUFBUTtpQkFDakI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLG1CQUFtQjtLQUN4QjtDQUNGLENBQUM7QUFtQkEsMERBQXVCO0FBakJ6QixNQUFNLG1CQUFtQixHQUFHO0lBQzFCLFVBQVUsRUFBRTtRQUNWLFdBQVcsRUFBRSxjQUFjO0tBUTVCO0NBQ0YsQ0FBQztBQUlBLGtEQUFtQiJ9