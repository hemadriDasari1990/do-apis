"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberAddFields = exports.memberLookup = exports.activeMemberLookup = exports.inActiveMemberLookup = exports.membersLookup = void 0;
const member_1 = __importDefault(require("../models/member"));
const teamMemberFilters_1 = require("./teamMemberFilters");
const memberLookup = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { reactedBy: "$reactedBy" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", "$$reactedBy"] },
                },
            },
            teamMemberFilters_1.teamMemberTeamsLookup,
        ],
        as: "reactedBy",
    },
};
exports.memberLookup = memberLookup;
const membersLookup = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { members: "$members" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ],
        as: "members",
    },
};
exports.membersLookup = membersLookup;
const inActiveMemberLookup = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { members: "$members" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
                    status: "inactive",
                },
            },
        ],
        as: "inActiveMembers",
    },
};
exports.inActiveMemberLookup = inActiveMemberLookup;
const activeMemberLookup = {
    $lookup: {
        from: member_1.default.collection.name,
        let: { members: "$members" },
        pipeline: [
            {
                $match: {
                    $expr: { $in: ["$_id", { $ifNull: ["$$members", []] }] },
                    status: "active",
                },
            },
        ],
        as: "activeMembers",
    },
};
exports.activeMemberLookup = activeMemberLookup;
const memberAddFields = {
    $addFields: {
        members: "$members",
        activeMembers: "$activeMembers",
        inActiveMembers: "$inActiveMembers",
        totalMembers: { $size: { $ifNull: ["$members", []] } },
        totalActiveMembers: { $size: { $ifNull: ["$activeMembers", []] } },
        totalInActiveMembers: {
            $size: { $ifNull: ["$inActiveMembers", []] },
        },
    },
};
exports.memberAddFields = memberAddFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVtYmVyRmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3V0aWwvbWVtYmVyRmlsdGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4REFBc0M7QUFDdEMsMkRBQTREO0FBRTVELE1BQU0sWUFBWSxHQUFHO0lBQ25CLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzVCLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7UUFDaEMsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsRUFBRTtpQkFDeEM7YUFDRjtZQUNELHlDQUFxQjtTQUN0QjtRQUNELEVBQUUsRUFBRSxXQUFXO0tBQ2hCO0NBQ0YsQ0FBQztBQXFFQSxvQ0FBWTtBQW5FZCxNQUFNLGFBQWEsR0FBRztJQUNwQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM1QixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO1FBQzVCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2lCQUN6RDthQUNGO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTthQUNsQjtTQUNGO1FBQ0QsRUFBRSxFQUFFLFNBQVM7S0FDZDtDQUNGLENBQUM7QUFnREEsc0NBQWE7QUE5Q2YsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxVQUFVLENBQUMsSUFBSTtRQUM1QixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO1FBQzVCLFFBQVEsRUFBRTtZQUNSO2dCQUNFLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUN4RCxNQUFNLEVBQUUsVUFBVTtpQkFDbkI7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLGlCQUFpQjtLQUN0QjtDQUNGLENBQUM7QUFpQ0Esb0RBQW9CO0FBL0J0QixNQUFNLGtCQUFrQixHQUFHO0lBQ3pCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzVCLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7UUFDNUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQ3hELE1BQU0sRUFBRSxRQUFRO2lCQUNqQjthQUNGO1NBQ0Y7UUFDRCxFQUFFLEVBQUUsZUFBZTtLQUNwQjtDQUNGLENBQUM7QUFrQkEsZ0RBQWtCO0FBaEJwQixNQUFNLGVBQWUsR0FBRztJQUN0QixVQUFVLEVBQUU7UUFDVixPQUFPLEVBQUUsVUFBVTtRQUNuQixhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLGVBQWUsRUFBRSxrQkFBa0I7UUFDbkMsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEQsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xFLG9CQUFvQixFQUFFO1lBQ3BCLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFO1NBQzdDO0tBQ0Y7Q0FDRixDQUFDO0FBT0EsMENBQWUifQ==