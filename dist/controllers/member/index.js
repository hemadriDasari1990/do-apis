"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamFromMember = exports.addTeamMemberToMember = exports.findMembersByTeamAndDelete = exports.deleteMember = exports.getMember = exports.getMembersByUser = exports.getMemberDetails = exports.createMember = exports.updateMember = void 0;
const teamMemberFilters_1 = require("../../util/teamMemberFilters");
const member_1 = __importDefault(require("../../models/member"));
// import { RESOURCE_ALREADY_EXISTS } from "../../util/constants";
const user_1 = require("../user");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateMember(req, res, next) {
    try {
        // const update = {
        //   name: req.body.name,
        //   email: req.body.email,
        //   userId: req.body.userId,
        //   status: req.body.status || "active",
        //   isVerified: req.body.isVerified || false,
        // };
        // const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.body.memberId),
        }, update = {
            $set: {
                name: req.body.name,
                email: req.body.email,
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
        // const member = await getMember({
        //   $and: [{ email: req.body.email }, { userId: req.body.userId }],
        // });
        // if (member) {
        //   return res.status(409).json({
        //     errorId: RESOURCE_ALREADY_EXISTS,
        //     message: `Member name ${member?.name} already exist. Please choose different name`,
        //   });
        // }
        const updated = await member_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        await user_1.addMemberToUser(updated === null || updated === void 0 ? void 0 : updated._id, req.body.userId);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateMember = updateMember;
async function createMember(payload) {
    try {
        const member = await new member_1.default(payload);
        return await member.save();
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.createMember = createMember;
async function getMemberDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const members = await member_1.default.aggregate([
            { $match: query },
            teamMemberFilters_1.teamMemberTeamsLookup,
        ]);
        return res.status(200).json(members);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getMemberDetails = getMemberDetails;
async function getMembersByUser(req, res) {
    try {
        const query = {
            userId: mongoose_1.default.Types.ObjectId(req.query.userId),
        };
        const members = await member_1.default.aggregate([
            { $match: query },
            teamMemberFilters_1.teamMemberTeamsLookup,
            teamMemberFilters_1.teamMemberTeamsAddFields,
        ]);
        return res.status(200).json(members);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getMembersByUser = getMembersByUser;
async function getMember(query) {
    try {
        const member = await member_1.default.findOne(query);
        return member;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.getMember = getMember;
async function deleteMember(req, res, next) {
    try {
        const deleted = await member_1.default.findByIdAndRemove(req.params.id);
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
exports.deleteMember = deleteMember;
async function findMembersByTeamAndDelete(teamId) {
    try {
        const membersList = await getMembersByTeam(teamId);
        if (!(membersList === null || membersList === void 0 ? void 0 : membersList.length)) {
            return;
        }
        const deleted = membersList.reduce(async (promise, member) => {
            await promise;
            await member_1.default.findByIdAndRemove(member._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findMembersByTeamAndDelete = findMembersByTeamAndDelete;
async function getMembersByTeam(teamId) {
    try {
        if (!teamId) {
            return;
        }
        return await member_1.default.find({ teamId });
    }
    catch (err) {
        throw `Error while fetching members ${err || err.message}`;
    }
}
async function addTeamMemberToMember(teamMemberId, memberId) {
    try {
        if (!teamMemberId || !teamMemberId) {
            return;
        }
        const updated = await member_1.default.findByIdAndUpdate(memberId, { $push: { teams: teamMemberId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.addTeamMemberToMember = addTeamMemberToMember;
async function removeTeamFromMember(memberId, teamId) {
    try {
        if (!memberId || !teamId) {
            return;
        }
        await member_1.default.findByIdAndUpdate(memberId, { $pull: { teams: teamId } });
    }
    catch (err) {
        throw new Error("Cannot remove team from member");
    }
}
exports.removeTeamFromMember = removeTeamFromMember;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9tZW1iZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0VBR3NDO0FBRXRDLGlFQUF5QztBQUN6QyxrRUFBa0U7QUFDbEUsa0NBQTBDO0FBQzFDLHdEQUFnQztBQUV6QixLQUFLLFVBQVUsWUFBWSxDQUNoQyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixtQkFBbUI7UUFDbkIseUJBQXlCO1FBQ3pCLDJCQUEyQjtRQUMzQiw2QkFBNkI7UUFDN0IseUNBQXlDO1FBQ3pDLDhDQUE4QztRQUM5QyxLQUFLO1FBQ0wsMEVBQTBFO1FBQzFFLE1BQU0sS0FBSyxHQUFHO1lBQ1YsR0FBRyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNoRCxFQUNELE1BQU0sR0FBRztZQUNQLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO2dCQUNuQixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNyQixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNO2dCQUN2QixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUTthQUNwQztTQUNGLEVBQ0QsT0FBTyxHQUFHO1lBQ1IsTUFBTSxFQUFFLElBQUk7WUFDWixHQUFHLEVBQUUsSUFBSTtZQUNULG1CQUFtQixFQUFFLElBQUk7WUFDekIsYUFBYSxFQUFFLElBQUk7WUFDbkIsTUFBTSxFQUFFLEtBQUs7U0FDZCxDQUFDO1FBQ0osbUNBQW1DO1FBQ25DLG9FQUFvRTtRQUNwRSxNQUFNO1FBQ04sZ0JBQWdCO1FBQ2hCLGtDQUFrQztRQUNsQyx3Q0FBd0M7UUFDeEMsMEZBQTBGO1FBQzFGLFFB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