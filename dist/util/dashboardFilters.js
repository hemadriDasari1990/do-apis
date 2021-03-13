"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFields = exports.dashboardLookup = void 0;
const departmentFilters_1 = require("./departmentFilters");
const projectFilters_1 = require("./projectFilters");
const boardFilters_1 = require("./boardFilters");
const dashboardLookup = {
    activeDepartmentsLookup: departmentFilters_1.activeDepartmentsLookup,
    inActiveDepartmentsLookup: departmentFilters_1.inActiveDepartmentsLookup,
    activeProjectsLookup: projectFilters_1.activeProjectsLookup,
    inActiveProjectsLookup: projectFilters_1.inActiveProjectsLookup,
    privateProjectsLookup: projectFilters_1.privateProjectsLookup,
    publicProjectsLookup: projectFilters_1.publicProjectsLookup,
    inProgressBoardsLookup: boardFilters_1.inProgressBoardsLookup,
    newBoardsLookup: boardFilters_1.newBoardsLookup,
    completedBoardsLookup: boardFilters_1.completedBoardsLookup,
};
exports.dashboardLookup = dashboardLookup;
const addFields = {
    $addFields: {
        totalActiveDepartments: { $size: { $ifNull: ["$activeDepartments", []] } },
        totalInActiveDepartments: {
            $size: { $ifNull: ["$inActiveDepartments", []] },
        },
        totalActiveProjects: { $size: { $ifNull: ["$activeProjects", []] } },
        totalInActiveProjects: { $size: { $ifNull: ["$inActiveProjects", []] } },
        totalPrivateProjects: {
            $size: { $ifNull: ["$privateProjects", []] },
        },
        totalPublicProjects: {
            $size: { $ifNull: ["$publicProjects", []] },
        },
        totalInProgressBoards: { $size: { $ifNull: ["$inProgressBoards", []] } },
        totalNewBoards: { $size: { $ifNull: ["$newBoards", []] } },
        totalCompletedBoards: { $size: { $ifNull: ["$completedBoards", []] } },
    },
};
exports.addFields = addFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkRmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWwvZGFzaGJvYXJkRmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFHNkI7QUFDN0IscURBSzBCO0FBQzFCLGlEQUl3QjtBQUV4QixNQUFNLGVBQWUsR0FBRztJQUN0Qix1QkFBdUIsRUFBdkIsMkNBQXVCO0lBQ3ZCLHlCQUF5QixFQUF6Qiw2Q0FBeUI7SUFDekIsb0JBQW9CLEVBQXBCLHFDQUFvQjtJQUNwQixzQkFBc0IsRUFBdEIsdUNBQXNCO0lBQ3RCLHFCQUFxQixFQUFyQixzQ0FBcUI7SUFDckIsb0JBQW9CLEVBQXBCLHFDQUFvQjtJQUNwQixzQkFBc0IsRUFBdEIscUNBQXNCO0lBQ3RCLGVBQWUsRUFBZiw4QkFBZTtJQUNmLHFCQUFxQixFQUFyQixvQ0FBcUI7Q0FDdEIsQ0FBQztBQXNCTywwQ0FBZTtBQXBCeEIsTUFBTSxTQUFTLEdBQUc7SUFDaEIsVUFBVSxFQUFFO1FBQ1Ysc0JBQXNCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFFLHdCQUF3QixFQUFFO1lBQ3hCLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxFQUFFO1NBQ2pEO1FBQ0QsbUJBQW1CLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BFLHFCQUFxQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4RSxvQkFBb0IsRUFBRTtZQUNwQixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRTtTQUM3QztRQUNELG1CQUFtQixFQUFFO1lBQ25CLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFO1NBQzVDO1FBQ0QscUJBQXFCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hFLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFELG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUN2RTtDQUNGLENBQUM7QUFFd0IsOEJBQVMifQ==