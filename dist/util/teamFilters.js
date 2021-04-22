"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamLookup = exports.teamAddFields = exports.activeTeamsLookup = exports.inActiveTeamsLookup = exports.teamsLookup = void 0;
const teamMemberFilters_1 = require("./teamMemberFilters");
const team_1 = __importDefault(require("../models/team"));
const teamLookup = {
    $lookup: {
        from: team_1.default.collection.name,
        let: { teamId: "$teamId" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", "$$teamId"] },
                },
            },
            teamMemberFilters_1.teamMemberMembersLookup,
            teamMemberFilters_1.teamMemberMembersAddFields,
        ],
        as: "team",
    },
};
exports.teamLookup = teamLookup;
const teamsLookup = {
    $lookup: {
        from: team_1.default.collection.name,
        let: { teams: "$teams" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
                },
            },
            {
                $sort: { _id: 1 },
            },
            teamMemberFilters_1.teamMemberMembersLookup,
            teamMemberFilters_1.teamMemberMembersAddFields,
        ],
        as: "teams",
    },
};
exports.teamsLookup = teamsLookup;
const inActiveTeamsLookup = {
    $lookup: {
        from: team_1.default.collection.name,
        let: { teams: "$teams" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
                    status: "inactive",
                },
            },
        ],
        as: "inActiveTeams",
    },
};
exports.inActiveTeamsLookup = inActiveTeamsLookup;
const activeTeamsLookup = {
    $lookup: {
        from: team_1.default.collection.name,
        let: { teams: "$teams" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
                    status: "active",
                },
            },
        ],
        as: "activeTeams",
    },
};
exports.activeTeamsLookup = activeTeamsLookup;
const teamAddFields = {
    $addFields: {
        members: "$members",
        activeMembers: "$activeMembers",
        inActiveMembers: "$inActiveMembers",
        totalMembers: { $size: { $ifNull: ["$members", []] } },
        totalActiveMembers: { $size: { $ifNull: ["$activeMembers", []] } },
        totalInActiveMembers: {
            $size: { $ifNull: ["$inActiveMembers", []] },
        },
        teams: "$teams",
        activeTeams: "$activeTeams",
        inActiveTeams: "$inActiveTeams",
        totalTeams: { $size: { $ifNull: ["$teams", []] } },
        totalActiveTeams: { $size: { $ifNull: ["$activeTeams", []] } },
        totalInActiveTeams: { $size: { $ifNull: ["$inActiveTeams", []] } },
    },
};
exports.teamAddFields = teamAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhbUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3RlYW1GaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUc2QjtBQUU3QiwwREFBa0M7QUFFbEMsTUFBTSxVQUFVLEdBQUc7SUFDakIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMxQixHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFO1FBQzFCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUU7aUJBQ3JDO2FBQ0Y7WUFDRCwyQ0FBdUI7WUFDdkIsOENBQTBCO1NBQzNCO1FBQ0QsRUFBRSxFQUFFLE1BQU07S0FDWDtDQUNGLENBQUM7QUE4RUEsZ0NBQVU7QUE1RVosTUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMxQixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtZQUNELDJDQUF1QjtZQUN2Qiw4Q0FBMEI7U0FDM0I7UUFDRCxFQUFFLEVBQUUsT0FBTztLQUNaO0NBQ0YsQ0FBQztBQXNEQSxrQ0FBVztBQXBEYixNQUFNLG1CQUFtQixHQUFHO0lBQzFCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDdEQsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxlQUFlO0tBQ3BCO0NBQ0YsQ0FBQztBQXVDQSxrREFBbUI7QUFyQ3JCLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMxQixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN0RCxNQUFNLEVBQUUsUUFBUTtpQkFDakI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLGFBQWE7S0FDbEI7Q0FDRixDQUFDO0FBd0JBLDhDQUFpQjtBQXRCbkIsTUFBTSxhQUFhLEdBQUc7SUFDcEIsVUFBVSxFQUFFO1FBQ1YsT0FBTyxFQUFFLFVBQVU7UUFDbkIsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixlQUFlLEVBQUUsa0JBQWtCO1FBQ25DLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RELGtCQUFrQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRSxvQkFBb0IsRUFBRTtZQUNwQixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRTtTQUM3QztRQUNELEtBQUssRUFBRSxRQUFRO1FBQ2YsV0FBVyxFQUFFLGNBQWM7UUFDM0IsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRCxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlELGtCQUFrQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNuRTtDQUNGLENBQUM7QUFNQSxzQ0FBYSJ9