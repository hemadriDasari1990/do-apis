"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamMemberMembersLookup = exports.teamMemberTeamsLookup = exports.teamMemberTeamsAddFields = exports.teamMemberMembersAddFields = void 0;
const member_1 = __importDefault(require("../models/member"));
const team_1 = __importDefault(require("../models/team"));
const teamMember_1 = __importDefault(require("../models/teamMember"));
const memberLookUp = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { memberId: "$memberId" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", "$$memberId"] },
                },
            },
        ],
        as: "member",
    },
};
const teamLookUp = {
    $lookup: {
        from: team_1.default.collection.name,
        let: { teamId: "$teamId" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", "$$teamId"] },
                },
            },
        ],
        as: "team",
    },
};
const teamMemberTeamsLookup = {
    $lookup: {
        from: teamMember_1.default.collection.name,
        let: { teams: "$teams" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$teams", []] }] },
                },
            },
            memberLookUp,
            teamLookUp,
            { $unwind: "$member" },
            { $unwind: "$team" },
        ],
        as: "teams",
    },
};
exports.teamMemberTeamsLookup = teamMemberTeamsLookup;
const teamMemberMembersLookup = {
    $lookup: {
        from: teamMember_1.default.collection.name,
        let: { members: "$members" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
                },
            },
            memberLookUp,
            teamLookUp,
            { $unwind: "$member" },
            { $unwind: "$team" },
        ],
        as: "members",
    },
};
exports.teamMemberMembersLookup = teamMemberMembersLookup;
const teamMemberTeamsAddFields = {
    $addFields: {
        teams: "$teams",
        totalTeams: { $size: { $ifNull: ["$teams", []] } },
    },
};
exports.teamMemberTeamsAddFields = teamMemberTeamsAddFields;
const teamMemberMembersAddFields = {
    $addFields: {
        members: "$members",
        totalMembers: { $size: { $ifNull: ["$members", []] } },
    },
};
exports.teamMemberMembersAddFields = teamMemberMembersAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVhbU1lbWJlckZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3RlYW1NZW1iZXJGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUFzQztBQUN0QywwREFBa0M7QUFDbEMsc0VBQThDO0FBRTlDLE1BQU0sWUFBWSxHQUFHO0lBQ25CLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzVCLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUU7UUFDOUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsRUFBRTtpQkFDdkM7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFFBQVE7S0FDYjtDQUNGLENBQUM7QUFFRixNQUFNLFVBQVUsR0FBRztJQUNqQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsY0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzFCLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7UUFDMUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtpQkFDckM7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLE1BQU07S0FDWDtDQUNGLENBQUM7QUFFRixNQUFNLHFCQUFxQixHQUFHO0lBQzVCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQ2hDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDeEIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUJBQ3ZEO2FBQ0Y7WUFDRCxZQUFZO1lBQ1osVUFBVTtZQUNWLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtZQUN0QixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7U0FDckI7UUFDRCxFQUFFLEVBQUUsT0FBTztLQUNaO0NBQ0YsQ0FBQztBQXNDQSxzREFBcUI7QUFwQ3ZCLE1BQU0sdUJBQXVCLEdBQUc7SUFDOUIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLG9CQUFVLENBQUMsVUFBVSxDQUFDLElBQUk7UUFDaEMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRTtRQUM1QixRQUFRLEVBQUU7WUFDUjtnQkFDRSxNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtpQkFDekQ7YUFDRjtZQUNELFlBQVk7WUFDWixVQUFVO1lBQ1YsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO1lBQ3RCLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtTQUNyQjtRQUNELEVBQUUsRUFBRSxTQUFTO0tBQ2Q7Q0FDRixDQUFDO0FBb0JBLDBEQUF1QjtBQWxCekIsTUFBTSx3QkFBd0IsR0FBRztJQUMvQixVQUFVLEVBQUU7UUFDVixLQUFLLEVBQUUsUUFBUTtRQUNmLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ25EO0NBQ0YsQ0FBQztBQVdBLDREQUF3QjtBQVQxQixNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLFVBQVUsRUFBRTtRQUNWLE9BQU8sRUFBRSxVQUFVO1FBQ25CLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ3ZEO0NBQ0YsQ0FBQztBQUdBLGdFQUEwQiJ9