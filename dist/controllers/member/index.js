"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInviteToMember = exports.sendInvitationsToMembers = exports.removeTeamFromMember = exports.addTeamMemberToMember = exports.findMembersByTeamAndDelete = exports.deleteMember = exports.getMember = exports.getMembersByUser = exports.getMemberDetails = exports.createMember = exports.updateMember = void 0;
const teamMemberFilters_1 = require("../../util/teamMemberFilters");
const email_1 = __importDefault(require("../../services/email"));
const member_1 = __importDefault(require("../../models/member"));
const user_1 = require("../user");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const board_1 = require("../board");
const util_1 = require("../../util");
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
        const query = {
            userId: mongoose_1.default.Types.ObjectId(req.query.userId),
        };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        if ((_a = req.query.queryString) === null || _a === void 0 ? void 0 : _a.length) {
            aggregators.push({
                $match: { $text: { $search: req.query.queryString, $language: "en" } },
            });
            aggregators.push({ $addFields: { score: { $meta: "textScore" } } });
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
                total: [{ $count: "count" }],
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
        await emailService.sendEmail("/templates/invite.ejs", {
            url: config_1.default.get("url"),
            invite_link: `${config_1.default.get("url")}/board/${board === null || board === void 0 ? void 0 : board._id}?source="email"`,
            name: receiver === null || receiver === void 0 ? void 0 : receiver.name,
            boardName: board === null || board === void 0 ? void 0 : board.title,
            projectName: (_a = board === null || board === void 0 ? void 0 : board.project) === null || _a === void 0 ? void 0 : _a.title,
            senderName: sender === null || sender === void 0 ? void 0 : sender.name,
        }, receiver.email, `You have been invited to join retrospective board ${board === null || board === void 0 ? void 0 : board.title}`);
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.sendInviteToMember = sendInviteToMember;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9tZW1iZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0VBR3NDO0FBQ3RDLGlFQUFnRDtBQUNoRCxpRUFBeUM7QUFDekMsa0NBQTBDO0FBQzFDLHdEQUFnQztBQUNoQyxvREFBNEI7QUFDNUIsb0NBQW9DO0FBQ3BDLHFDQUEyQztBQUVwQyxLQUFLLFVBQVUsWUFBWSxDQUNoQyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRztZQUNWLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDaEQsRUFDRCxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFDbkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDckIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDdkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVE7YUFDcEM7U0FDRixFQUNELE9BQU8sR0FBRztZQUNSLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxFQUFFLElBQUk7WUFDVCxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLE1BQU0sRUFBRSxLQUFLO1NBQ2QsQ0FBQztRQUNKLE1BQU0sT0FBTyxHQUFRLE1BQU0sZ0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE1B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