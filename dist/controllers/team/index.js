"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitationToTeams = exports.removeMemberFromTeam = exports.addTeamMemberToTeam = exports.addOrRemoveMemberFromTeam = exports.deleteTeam = exports.getTeams = exports.updateTeam = void 0;
const member_1 = require("../member");
const teamMemberFilters_1 = require("../../util/teamMemberFilters");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
            team: mongoose_1.default.Types.ObjectId(req.body.teamId),
            member: mongoose_1.default.Types.ObjectId(req.body.memberId),
        }, update = {
            $set: {
                team: req.body.teamId,
                member: req.body.memberId,
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
        const sender = jsonwebtoken_1.default.decode(token);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy90ZWFtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHNDQU1tQjtBQUNuQixvRUFHc0M7QUFDdEMsZ0VBQStCO0FBRS9CLGtFQUFrRTtBQUNsRSw2REFBcUM7QUFDckMseUVBQWlEO0FBQ2pELGtDQUF3QztBQUN4Qyx3REFBZ0M7QUFDaEMscUNBQXNDO0FBQ3RDLG9EQUFnRDtBQUNoRCwrREFBdUM7QUFDdkMsOENBQWlEO0FBQ2pELG9DQUFvQztBQUU3QixLQUFLLFVBQVUsVUFBVSxDQUM5QixHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixtQkFBbUI7UUFDbkIseUJBQXlCO1FBQ3pCLHVDQUF1QztRQUN2Qyw2QkFBNkI7UUFDN0IseUNBQXlDO1FBQ3pDLEtBQUs7UUFDTCwwRUFBMEU7UUFDMUUsK0JBQStCO1FBQy9CLGtFQUFrRTtRQUNsRSxNQUFNO1FBQ04sY0FBYztRQUNkLGtDQUFrQztRQUNsQyx3Q0FBd0M7UUFDeEMsc0ZBQXNGO1FBQ3RGLFFBQVE7UUFDUixJQUFJO1FBRUosTUFBTSxLQUFLLEdBQUc7WUFDVixHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzlDLEVBQ0QsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ3ZCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRO2FBQ3BDO1NBQ0YsRUFDRCxPQUFPLEdBQUc7WUFDUixNQUFNLEVBQUUs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