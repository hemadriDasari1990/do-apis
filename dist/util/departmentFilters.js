"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentAddFields = exports.activeDepartmentsLookup = exports.inActiveDepartmentsLookup = exports.departmentsLookup = void 0;
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
            // {
            //   $group: {
            //     _id: null,
            //     totalProjects: { $sum: { $size: "$projectId" } },
            //   },
            // },
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
        activeDepartments: "$activeDepartments",
        inActiveDepartments: "$inActiveDepartments",
        totalDepartments: { $size: { $ifNull: ["$departments", []] } },
        totalActiveDepartments: { $size: { $ifNull: ["$activeDepartments", []] } },
        totalInActiveDepartments: {
            $size: { $ifNull: ["$inActiveDepartments", []] },
        },
        projects: "$projects",
        activeProjects: "$activeProjects",
        inActiveProjects: "$inActiveProjects",
        privateProjects: "$privateProjects",
        publicProjects: "$publicProjects",
        totalProjects: { $size: { $ifNull: ["$projects", []] } },
        totalActiveProjects: { $size: { $ifNull: ["$activeProjects", []] } },
        totalInActiveProjects: { $size: { $ifNull: ["$inActiveProjects", []] } },
        totalPrivateProjects: {
            $size: { $ifNull: ["$privateProjects", []] },
        },
        totalPublicProjects: {
            $size: { $ifNull: ["$publicProjects", []] },
        },
    },
};
exports.departmentAddFields = departmentAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0bWVudEZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2RlcGFydG1lbnRGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFEQU8wQjtBQUUxQixzRUFBOEM7QUFFOUMsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO1FBQ3BDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUM3RDthQUNGO1lBQ0QsSUFBSTtZQUNKLGNBQWM7WUFDZCxpQkFBaUI7WUFDakIsd0RBQXdEO1lBQ3hELE9BQU87WUFDUCxLQUFLO1lBQ0w7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtZQUVELCtCQUFjO1lBQ2QscUNBQW9CO1lBQ3BCLHVDQUFzQjtZQUN0QixzQ0FBcUI7WUFDckIscUNBQW9CO1lBQ3BCLGlDQUFnQjtTQUNqQjtRQUNELEVBQUUsRUFBRSxhQUFhO0tBQ2xCO0NBQ0YsQ0FBQztBQThEQSw4Q0FBaUI7QUE1RG5CLE1BQU0seUJBQXlCLEdBQUc7SUFDaEMsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLG9CQUFVLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDaEMsR0FBRyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRTtRQUNwQyxRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDNUQsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxxQkFBcUI7S0FDMUI7Q0FDRixDQUFDO0FBK0NBLDhEQUF5QjtBQTdDM0IsTUFBTSx1QkFBdUIsR0FBRztJQUM5QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsb0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUNoQyxHQUFHLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFO1FBQ3BDLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUM1RCxNQUFNLEVBQUUsUUFBUTtpQkFDakI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLG1CQUFtQjtLQUN4QjtDQUNGLENBQUM7QUFnQ0EsMERBQXVCO0FBOUJ6QixNQUFNLG1CQUFtQixHQUFHO0lBQzFCLFVBQVUsRUFBRTtRQUNWLFdBQVcsRUFBRSxjQUFjO1FBQzNCLGlCQUFpQixFQUFFLG9CQUFvQjtRQUN2QyxtQkFBbUIsRUFBRSxzQkFBc0I7UUFDM0MsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5RCxzQkFBc0IsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUUsd0JBQXdCLEVBQUU7WUFDeEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLEVBQUU7U0FDakQ7UUFDRCxRQUFRLEVBQUUsV0FBVztRQUNyQixjQUFjLEVBQUUsaUJBQWlCO1FBQ2pDLGdCQUFnQixFQUFFLG1CQUFtQjtRQUNyQyxlQUFlLEVBQUUsa0JBQWtCO1FBQ25DLGNBQWMsRUFBRSxpQkFBaUI7UUFDakMsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDeEQsbUJBQW1CLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BFLHFCQUFxQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4RSxvQkFBb0IsRUFBRTtZQUNwQixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRTtTQUM3QztRQUNELG1CQUFtQixFQUFFO1lBQ25CLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFO1NBQzVDO0tBQ0Y7Q0FDRixDQUFDO0FBTUEsa0RBQW1CIn0=