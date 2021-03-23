"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamAddFields = exports.activeTeamsLookup = exports.inActiveTeamsLookup = exports.teamsLookup = void 0;
const teamMemberFilters_1 = require("./teamMemberFilters");
const team_1 = __importDefault(require("../models/team"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhbUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3RlYW1GaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUc2QjtBQUU3QiwwREFBa0M7QUFFbEMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMxQixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtZQUNELDJDQUF1QjtZQUN2Qiw4Q0FBMEI7U0FDM0I7UUFDRCxFQUFFLEVBQUUsT0FBTztLQUNaO0NBQ0YsQ0FBQztBQXFETyxrQ0FBVztBQW5EcEIsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsY0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzFCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDeEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ3RELE1BQU0sRUFBRSxVQUFVO2lCQUNuQjthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsZUFBZTtLQUNwQjtDQUNGLENBQUM7QUFxQ29CLGtEQUFtQjtBQW5DekMsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsY0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzFCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDeEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ3RELE1BQU0sRUFBRSxRQUFRO2lCQUNqQjthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsYUFBYTtLQUNsQjtDQUNGLENBQUM7QUFxQnlDLDhDQUFpQjtBQW5CNUQsTUFBTSxhQUFhLEdBQUc7SUFDcEIsVUFBVSxFQUFFO1FBQ1YsT0FBTyxFQUFFLFVBQVU7UUFDbkIsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixlQUFlLEVBQUUsa0JBQWtCO1FBQ25DLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RELGtCQUFrQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRSxvQkFBb0IsRUFBRTtZQUNwQixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRTtTQUM3QztRQUNELEtBQUssRUFBRSxRQUFRO1FBQ2YsV0FBVyxFQUFFLGNBQWM7UUFDM0IsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsRCxnQkFBZ0IsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlELGtCQUFrQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNuRTtDQUNGLENBQUM7QUFFNEQsc0NBQWEifQ==