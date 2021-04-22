"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInviteToMember = exports.sendInvitationsToMembers = exports.removeTeamFromMember = exports.addTeamMemberToMember = exports.findMembersByTeamAndDelete = exports.deleteMember = exports.searchMembers = exports.getMember = exports.getMembersByUser = exports.getMemberDetails = exports.createMember = exports.updateMember = void 0;
const teamMemberFilters_1 = require("../../util/teamMemberFilters");
const email_1 = __importDefault(require("../../services/email"));
const member_1 = __importDefault(require("../../models/member"));
const user_1 = require("../user");
const config_1 = __importDefault(require("config"));
const board_1 = require("../board");
const util_1 = require("../../util");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateMember(req, res, next) {
    try {
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
    var _a;
    try {
        const query = Object.assign({ userId: mongoose_1.default.Types.ObjectId(req.query.userId) }, (req.query.status ? { status: req.query.status } : {}));
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        if ((_a = req.query.queryString) === null || _a === void 0 ? void 0 : _a.length) {
            aggregators.push({
                $match: {
                    $or: [
                        { name: { $regex: req.query.queryString, $options: "i" } },
                        { email: { $regex: req.query.queryString, $options: "i" } },
                    ],
                },
            });
        }
        aggregators.push({
            $facet: {
                data: [
                    { $match: query },
                    { $sort: { _id: -1 } },
                    { $skip: offset },
                    { $limit: limit },
                    teamMemberFilters_1.teamMemberTeamsLookup,
                    teamMemberFilters_1.teamMemberTeamsAddFields,
                ],
                total: [{ $match: query }, { $count: "count" }],
            },
        });
        const members = await member_1.default.aggregate(aggregators);
        return res.status(200).send(members ? members[0] : null);
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
async function searchMembers(queryString) {
    try {
        const members = await member_1.default.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: queryString, $options: "i" } },
                        { email: { $regex: queryString, $options: "i" } },
                    ],
                },
            },
        ]);
        return members;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.searchMembers = searchMembers;
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
async function sendInvitationsToMembers(memberIds, sender, boardId) {
    try {
        if (!(memberIds === null || memberIds === void 0 ? void 0 : memberIds.length) || !sender || !boardId) {
            return;
        }
        const board = await board_1.getBoard({
            _id: mongoose_1.default.Types.ObjectId(boardId),
        });
        if (!board) {
            return;
        }
        return await memberIds.reduce(async (promise, memberId) => {
            await promise;
            const member = await getMember({
                _id: mongoose_1.default.Types.ObjectId(memberId),
            });
            await sendInviteToMember(board, sender, member);
        }, Promise.resolve());
    }
    catch (err) {
        return new Error("Cannot remove team from member");
    }
}
exports.sendInvitationsToMembers = sendInvitationsToMembers;
async function sendInviteToMember(board, sender, receiver) {
    var _a;
    try {
        if (!sender || !receiver || !board) {
            return;
        }
        const emailService = await new email_1.default();
        const sent = await emailService.sendEmail("/templates/invite.ejs", {
            url: config_1.default.get("url"),
            invite_link: `${config_1.default.get("url")}/board/${board === null || board === void 0 ? void 0 : board._id}?email=${receiver === null || receiver === void 0 ? void 0 : receiver.email}&name=${receiver === null || receiver === void 0 ? void 0 : receiver.name}`,
            name: receiver === null || receiver === void 0 ? void 0 : receiver.name,
            boardName: board === null || board === void 0 ? void 0 : board.title,
            projectName: (_a = board === null || board === void 0 ? void 0 : board.project) === null || _a === void 0 ? void 0 : _a.title,
            senderName: sender === null || sender === void 0 ? void 0 : sender.name,
        }, receiver.email, `You have been invited to join retrospective board ${board === null || board === void 0 ? void 0 : board.title}`);
        return sent;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.sendInviteToMember = sendInviteToMember;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9tZW1iZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0VBR3NDO0FBRXRDLGlFQUFnRDtBQUNoRCxpRUFBeUM7QUFDekMsa0NBQTBDO0FBQzFDLG9EQUE0QjtBQUM1QixvQ0FBb0M7QUFDcEMscUNBQTJDO0FBQzNDLHdEQUFnQztBQUV6QixLQUFLLFVBQVUsWUFBWSxDQUNoQyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRztZQUNWLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDaEQsRUFDRCxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFDbkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDckIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDdkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVE7YUFDcEM7U0FDRixFQUNELE9BQU8sR0FBRztZQUNSLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxFQUFFLElBQUk7WUFDVCxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLE1BQU0sRUFBRSxLQUFLO1NBQ2QsQ0FBQztRQUNKLE1BQU0sT0FBTyxHQUFRLE1BQU0sZ0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE1B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