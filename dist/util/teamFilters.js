"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamAddFields = exports.activeTeamsLookup = exports.inActiveTeamsLookup = exports.teamsLookup = void 0;
const memberFilters_1 = require("./memberFilters");
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
            memberFilters_1.membersLookup,
            memberFilters_1.activeMemberLookup,
            memberFilters_1.inActiveMemberLookup,
            memberFilters_1.memberAddFields,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhbUZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3RlYW1GaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG1EQUt5QjtBQUV6QiwwREFBa0M7QUFFbEMsTUFBTSxXQUFXLEdBQUc7SUFDbEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLGNBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUMxQixHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3hCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUN2RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtZQUNELDZCQUFhO1lBQ2Isa0NBQWtCO1lBQ2xCLG9DQUFvQjtZQUNwQiwrQkFBZTtTQUNoQjtRQUNELEVBQUUsRUFBRSxPQUFPO0tBQ1o7Q0FDRixDQUFDO0FBcURPLGtDQUFXO0FBbkRwQixNQUFNLG1CQUFtQixHQUFHO0lBQzFCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDdEQsTUFBTSxFQUFFLFVBQVU7aUJBQ25CO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxlQUFlO0tBQ3BCO0NBQ0YsQ0FBQztBQXFDb0Isa0RBQW1CO0FBbkN6QyxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxjQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDMUIsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUN4QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDdEQsTUFBTSxFQUFFLFFBQVE7aUJBQ2pCO2FBQ0Y7U0FDRjtRQUNELEVBQUUsRUFBRSxhQUFhO0tBQ2xCO0NBQ0YsQ0FBQztBQXFCeUMsOENBQWlCO0FBbkI1RCxNQUFNLGFBQWEsR0FBRztJQUNwQixVQUFVLEVBQUU7UUFDVixPQUFPLEVBQUUsVUFBVTtRQUNuQixhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLGVBQWUsRUFBRSxrQkFBa0I7UUFDbkMsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEQsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xFLG9CQUFvQixFQUFFO1lBQ3BCLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFO1NBQzdDO1FBQ0QsS0FBSyxFQUFFLFFBQVE7UUFDZixXQUFXLEVBQUUsY0FBYztRQUMzQixhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xELGdCQUFnQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDOUQsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ25FO0NBQ0YsQ0FBQztBQUU0RCxzQ0FBYSJ9