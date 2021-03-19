"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberFromTeam = exports.addTeamMemberToTeam = exports.addOrRemoveMemberFromTeam = exports.deleteTeam = exports.getTeams = exports.updateTeam = void 0;
const member_1 = require("../member");
const teamMemberFilters_1 = require("../../util/teamMemberFilters");
// import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
const team_1 = __importDefault(require("../../models/team"));
const teamMember_1 = __importDefault(require("../../models/teamMember"));
const user_1 = require("../user");
const mongoose_1 = __importDefault(require("mongoose"));
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
        const team = await team_1.default.findOne(query);
        return team;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy90ZWFtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHNDQUttQjtBQUNuQixvRUFHc0M7QUFFdEMsa0VBQWtFO0FBQ2xFLDZEQUFxQztBQUNyQyx5RUFBaUQ7QUFDakQsa0NBQXdDO0FBQ3hDLHdEQUFnQztBQUV6QixLQUFLLFVBQVUsVUFBVSxDQUM5QixHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixtQkFBbUI7UUFDbkIseUJBQXlCO1FBQ3pCLHVDQUF1QztRQUN2Qyw2QkFBNkI7UUFDN0IseUNBQXlDO1FBQ3pDLEtBQUs7UUFDTCwwRUFBMEU7UUFDMUUsK0JBQStCO1FBQy9CLGtFQUFrRTtRQUNsRSxNQUFNO1FBQ04sY0FBYztRQUNkLGtDQUFrQztRQUNsQyx3Q0FBd0M7UUFDeEMsc0ZBQXNGO1FBQ3RGLFFBQVE7UUFDUixJQUFJO1FBRUosTUFBTSxLQUFLLEdBQUc7WUFDVixHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzlDLEVBQ0QsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ3ZCLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRO2FBQ3BDO1NBQ0YsRUFDRCxPQUFPLEdBQUc7WUFDUixNQUFNLEVBQUUsSUFBSTtZQUNaLEdBQUcsRUFBRSxJQUFJO1lBQ1QsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixhQUFhLEVBQUUsSUFBSTtZQUNuQixNQUFN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