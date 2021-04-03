"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitationToTeams = exports.removeMemberFromTeam = exports.addTeamMemberToTeam = exports.addOrRemoveMemberFromTeam = exports.deleteTeam = exports.getTeams = exports.updateTeam = void 0;
const member_1 = require("../member");
const teamMemberFilters_1 = require("../../util/teamMemberFilters");
// import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
const team_1 = __importDefault(require("../../models/team"));
const teamMember_1 = __importDefault(require("../../models/teamMember"));
const user_1 = require("../user");
const mongoose_1 = __importDefault(require("mongoose"));
const util_1 = require("../../util");
const constants_1 = require("../../util/constants");
const board_1 = __importDefault(require("../../models/board"));
const member_2 = require("../../util/member");
const board_2 = require("../board");
async function updateTeam(req, res, next) {
    try {
        // const update = {
        //   name: req.body.name,
        //   description: req.body.description,
        //   userId: req.body.userId,
        //   status: req.body.status || "active",
        // };
        // const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        // const team = await getTeam({
        //   $and: [{ name: req.body.name }, { userId: req.body.userId }],
        // });
        // if (team) {
        //   return res.status(409).json({
        //     errorId: RESOURCE_ALREADY_EXISTS,
        //     message: `Team with ${team?.name} already exist. Please choose different name`,
        //   });
        // }
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.body.teamId),
        }, update = {
            $set: {
                name: req.body.name,
                description: req.body.description,
                userId: req.body.userId,
                status: req.body.status || "active",
            },
        }, options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
            runValidators: true,
            strict: false,
        };
        const updated = await team_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        await user_1.addTeamToUser(updated === null || updated === void 0 ? void 0 : updated._id, req.body.userId);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateTeam = updateTeam;
// export async function getTeamDetails(
//   req: Request,
//   res: Response
// ): Promise<any> {
//   try {
//     const query = { _id: mongoose.Types.ObjectId(req.params.id) };
//     const teams = await Team.aggregate([
//       { $match: query },
//       membersLookup,
//       memberAddFields,
//     ]);
//     return res.status(200).json(teams);
//   } catch (err) {
//     return res.status(500).send(err || err.message);
//   }
// }
async function getTeams(req, res) {
    try {
        const query = {
            userId: mongoose_1.default.Types.ObjectId(req.query.userId),
        };
        const teams = await team_1.default.aggregate([
            { $match: query },
            teamMemberFilters_1.teamMemberMembersLookup,
            teamMemberFilters_1.teamMemberMembersAddFields,
        ]);
        return res.status(200).json(teams);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getTeams = getTeams;
async function getTeam(query) {
    try {
        const teams = await team_1.default.aggregate([
            { $match: query },
            teamMemberFilters_1.teamMemberMembersLookup,
            teamMemberFilters_1.teamMemberMembersAddFields,
        ]);
        return teams ? teams[0] : null;
    }
    catch (err) {
        throw err | err.message;
    }
}
async function deleteTeam(req, res, next) {
    try {
        await member_1.findMembersByTeamAndDelete(req.params.id);
        const deleted = await team_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res.status(200).json({ deleted: true });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteTeam = deleteTeam;
async function getTemMember(query) {
    try {
        if (!query) {
            return;
        }
        const teamMember = await teamMember_1.default.findOne(query);
        return teamMember;
    }
    catch (err) {
        throw err || err.message;
    }
}
async function removeTeamMember(id) {
    try {
        if (!id) {
            return;
        }
        await teamMember_1.default.findOneAndRemove({
            _id: id,
        });
    }
    catch (err) {
        throw err || err.message;
    }
}
async function updateTeamMember(query, update, options) {
    try {
        if (!query || !update) {
            return;
        }
        const updated = await teamMember_1.default.findOneAndUpdate(query, update, options);
        return updated;
    }
    catch (err) {
        throw err || err.message;
    }
}
async function getTeamMember(query) {
    try {
        if (!query) {
            return;
        }
        const teamMember = await teamMember_1.default.findOne(query).populate([
            {
                path: "member",
                model: "Member",
            },
            {
                path: "team",
                model: "Team",
            },
        ]);
        return teamMember;
    }
    catch (err) {
        throw err || err.message;
    }
}
async function addOrRemoveMemberFromTeam(req, res) {
    var _a, _b, _c, _d;
    try {
        const query = {
            teamId: mongoose_1.default.Types.ObjectId(req.body.teamId),
            memberId: mongoose_1.default.Types.ObjectId(req.body.memberId),
        }, update = {
            $set: {
                teamId: req.body.teamId,
                memberId: req.body.memberId,
            },
        }, options = { upsert: true, new: true };
        const teamMember = await getTemMember(query);
        const member = await member_1.getMember({
            _id: mongoose_1.default.Types.ObjectId(req.body.memberId),
        });
        const team = await getTeam({
            _id: mongoose_1.default.Types.ObjectId(req.body.teamId),
        });
        if (teamMember) {
            await removeTeamMember(teamMember === null || teamMember === void 0 ? void 0 : teamMember._id);
            if (member && ((_a = member.teams) === null || _a === void 0 ? void 0 : _a.includes(teamMember === null || teamMember === void 0 ? void 0 : teamMember._id))) {
                await member_1.removeTeamFromMember(req.body.memberId, teamMember === null || teamMember === void 0 ? void 0 : teamMember._id);
            }
            if (team && ((_b = team.members) === null || _b === void 0 ? void 0 : _b.includes(teamMember === null || teamMember === void 0 ? void 0 : teamMember._id))) {
                await removeMemberFromTeam(teamMember === null || teamMember === void 0 ? void 0 : teamMember._id, req.body.teamId);
            }
            return res.status(200).json({ removed: true });
        }
        const teamMemberUpdated = await updateTeamMember(query, update, options);
        if (team && !((_c = team.members) === null || _c === void 0 ? void 0 : _c.includes(teamMemberUpdated === null || teamMemberUpdated === void 0 ? void 0 : teamMemberUpdated._id))) {
            await addTeamMemberToTeam(teamMemberUpdated === null || teamMemberUpdated === void 0 ? void 0 : teamMemberUpdated._id, req.body.teamId);
        }
        if (member && !((_d = member.teams) === null || _d === void 0 ? void 0 : _d.includes(teamMemberUpdated === null || teamMemberUpdated === void 0 ? void 0 : teamMemberUpdated._id))) {
            await member_1.addTeamMemberToMember(teamMemberUpdated === null || teamMemberUpdated === void 0 ? void 0 : teamMemberUpdated._id, req.body.memberId);
        }
        const updatedTeamMember = await getTeamMember({
            _id: mongoose_1.default.Types.ObjectId(teamMemberUpdated === null || teamMemberUpdated === void 0 ? void 0 : teamMemberUpdated._id),
        });
        return res.status(200).json(updatedTeamMember);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.addOrRemoveMemberFromTeam = addOrRemoveMemberFromTeam;
async function addTeamMemberToTeam(teamMemberId, teamId) {
    try {
        if (!teamMemberId || !teamId) {
            return;
        }
        const updated = await team_1.default.findByIdAndUpdate(teamId, { $push: { members: teamMemberId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding member to the team ${err || err.message}`;
    }
}
exports.addTeamMemberToTeam = addTeamMemberToTeam;
async function removeMemberFromTeam(memberId, teamId) {
    try {
        if (!memberId || !teamId) {
            return;
        }
        await team_1.default.findByIdAndUpdate(teamId, { $pull: { members: memberId } });
    }
    catch (err) {
        throw new Error("Error while removing team from member");
    }
}
exports.removeMemberFromTeam = removeMemberFromTeam;
async function sendInvitationToTeams(req, res) {
    try {
        const teamIds = req.body.teamIds;
        if (!teamIds || !(teamIds === null || teamIds === void 0 ? void 0 : teamIds.length)) {
            return res.status(500).json({
                errorId: constants_1.REQUIRED,
                message: `Team id's are required in an array`,
            });
        }
        const authHeader = req.headers.authorization;
        const token = util_1.getToken(authHeader);
        const sender = util_1.decodeToken(token);
        await teamIds.reduce(async (promise, teamId) => {
            await promise;
            const team = await getTeam({
                _id: mongoose_1.default.Types.ObjectId(teamId),
            });
            const memberIds = await member_2.getMemberIds(team === null || team === void 0 ? void 0 : team.members);
            await member_1.sendInvitationsToMembers(memberIds, sender, req.body.boardId);
        }, Promise.resolve());
        const board = await board_2.getBoard({
            _id: mongoose_1.default.Types.ObjectId(req.body.boardId),
        });
        const update = {
            $set: {
                inviteSent: true,
                inviteCount: (board === null || board === void 0 ? void 0 : board.inviteCount) + 1,
            },
        };
        const updatedBoard = await board_1.default.findByIdAndUpdate(req.body.boardId, update, { new: true });
        return res.status(200).json({
            board: updatedBoard,
            inviteSent: true,
            message: `Invitations has been sent to ${teamIds === null || teamIds === void 0 ? void 0 : teamIds.length} teams`,
        });
    }
    catch (err) {
        throw new Error("Error while sending invite to teams");
    }
}
exports.sendInvitationToTeams = sendInvitationToTeams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy90ZWFtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHNDQU1tQjtBQUNuQixvRUFHc0M7QUFFdEMsa0VBQWtFO0FBQ2xFLDZEQUFxQztBQUNyQyx5RUFBaUQ7QUFDakQsa0NBQXdDO0FBQ3hDLHdEQUFnQztBQUNoQyxxQ0FBbUQ7QUFDbkQsb0RBQWdEO0FBQ2hELCtEQUF1QztBQUN2Qyw4Q0FBaUQ7QUFDakQsb0NBQW9DO0FBRTdCLEtBQUssVUFBVSxVQUFVLENBQzlCLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsSUFBSTtRQUNGLG1CQUFtQjtRQUNuQix5QkFBeUI7UUFDekIsdUNBQXVDO1FBQ3ZDLDZCQUE2QjtRQUM3Qix5Q0FBeUM7UUFDekMsS0FBSztRQUNMLDBFQUEwRTtRQUMxRSwrQkFBK0I7UUFDL0Isa0VBQWtFO1FBQ2xFLE1BQU07UUFDTixjQUFjO1FBQ2Qsa0NBQWtDO1FBQ2xDLHdDQUF3QztRQUN4QyxzRkFBc0Y7UUFDdEYsUUFBUTtRQUNSLElBQUk7UUFFSixNQUFNLEtBQUssR0FBRztZQUNWLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDOUMsRUFDRCxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFDbkIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDakMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDdkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVE7YUFDcEM7U0FDRixFQUNELE9BQU8sR0FBRztZQUNSLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FB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