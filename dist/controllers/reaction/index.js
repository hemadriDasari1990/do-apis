"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReactionSummaryByNote = exports.getReactionSummaryBySection = exports.getReactionSummaryByBoard = exports.getReaction = exports.getReactions = exports.findReactionsByNoteAndDelete = exports.createOrUpdateReaction = void 0;
const note_1 = require("../note");
const board_1 = __importDefault(require("../../models/board"));
const note_2 = __importDefault(require("../../models/note"));
const reaction_1 = __importDefault(require("../../models/reaction"));
const section_1 = __importDefault(require("../../models/section"));
const activity_1 = require("../activity");
const member_1 = require("../member");
const util_1 = require("../../util");
const memberFilters_1 = require("../../util/memberFilters");
const mongoose_1 = __importDefault(require("mongoose"));
const noteFilters_1 = require("../../util/noteFilters");
const reactionFilters_1 = require("../../util/reactionFilters");
const sectionFilters_1 = require("../../util/sectionFilters");
async function createOrUpdateReaction(payload) {
    var _a, _b;
    try {
        /* Get the admin member */
        const member = await member_1.getMember({
            userId: payload.reactedBy,
            isAuthor: true,
            isVerified: true,
        });
        const query = payload.reactedBy
            ? {
                $and: [
                    { noteId: mongoose_1.default.Types.ObjectId(payload.noteId) },
                    { reactedBy: mongoose_1.default.Types.ObjectId(member === null || member === void 0 ? void 0 : member._id) },
                ],
            }
            : {
                reactedBy: { $exists: false },
            }, update = {
            $set: {
                noteId: payload.noteId,
                reactedBy: member === null || member === void 0 ? void 0 : member._id,
                type: payload === null || payload === void 0 ? void 0 : payload.type,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const note = await note_1.getNote({
            _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.noteId),
        });
        const reactionDetails = await getReaction({
            $and: [
                { reactedBy: mongoose_1.default.Types.ObjectId(member === null || member === void 0 ? void 0 : member._id) },
                { noteId: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.noteId) },
            ],
        });
        /* Remove only if member is known */
        if (reactionDetails &&
            payload.reactedBy &&
            (reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails.type) === (payload === null || payload === void 0 ? void 0 : payload.type)) {
            if ((_a = note === null || note === void 0 ? void 0 : note.reactions) === null || _a === void 0 ? void 0 : _a.includes(reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails._id)) {
                await note_1.removeReactionFromNote(reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails._id, payload === null || payload === void 0 ? void 0 : payload.noteId);
            }
            await removeReactionById(reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails._id);
            await activity_1.createActivity({
                userId: payload.reactedBy,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
                title: payload === null || payload === void 0 ? void 0 : payload.type,
                primaryAction: "to",
                primaryTitle: note === null || note === void 0 ? void 0 : note.description,
                type: payload === null || payload === void 0 ? void 0 : payload.type,
                action: "un-react",
            });
            return Object.assign({ removed: true }, reactionDetails);
        }
        const reactionUpdated = await updateReaction(query, update, options);
        if (!reactionUpdated) {
            return {};
        }
        const newReaction = await getReaction({
            _id: mongoose_1.default.Types.ObjectId(reactionUpdated === null || reactionUpdated === void 0 ? void 0 : reactionUpdated._id),
        });
        if (!((_b = note === null || note === void 0 ? void 0 : note.reactions) === null || _b === void 0 ? void 0 : _b.includes(newReaction === null || newReaction === void 0 ? void 0 : newReaction._id))) {
            await note_1.addReactionToNote(newReaction._id, payload.noteId);
            await activity_1.createActivity({
                userId: payload.reactedBy,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
                title: payload === null || payload === void 0 ? void 0 : payload.type,
                primaryAction: "to",
                primaryTitle: note === null || note === void 0 ? void 0 : note.description,
                type: payload === null || payload === void 0 ? void 0 : payload.type,
                action: "react",
            });
        }
        return newReaction;
    }
    catch (err) {
        throw new Error(err || err.message);
    }
}
exports.createOrUpdateReaction = createOrUpdateReaction;
async function updateReaction(query, update, options) {
    try {
        if (!query || !update) {
            return;
        }
        const updated = await reaction_1.default.findOneAndUpdate(query, update, options);
        return updated;
    }
    catch (err) {
        throw err || err.message;
    }
}
async function findReactionsByNoteAndDelete(noteId) {
    try {
        const reactionsList = await getReactionsByNote({ noteId });
        if (!(reactionsList === null || reactionsList === void 0 ? void 0 : reactionsList.length)) {
            return;
        }
        const deleted = reactionsList.reduce(async (promise, note) => {
            await promise;
            await removeReactionById(note._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findReactionsByNoteAndDelete = findReactionsByNoteAndDelete;
async function removeReactionById(reactionId) {
    try {
        if (!reactionId) {
            return;
        }
        return await reaction_1.default.findByIdAndRemove(reactionId);
    }
    catch (err) {
        throw `Error while deleting note ${err || err.message}`;
    }
}
async function getReactionsByNote(query) {
    try {
        if (!query) {
            return;
        }
        return await reaction_1.default.find(query);
    }
    catch (err) {
        throw `Error while fetching notes ${err || err.message}`;
    }
}
async function getReactions(req, res) {
    try {
        const query = {
            noteId: mongoose_1.default.Types.ObjectId(req.query.noteId),
        };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        aggregators.push({
            $facet: {
                data: [
                    { $match: query },
                    { $sort: { _id: -1 } },
                    { $skip: offset },
                    { $limit: limit },
                    memberFilters_1.memberLookup,
                    {
                        $unwind: {
                            path: "$reactedBy",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ],
                total: [{ $match: query }, { $count: "count" }],
            },
        });
        const reactions = await reaction_1.default.aggregate(aggregators);
        return res.status(200).send(reactions ? reactions[0] : reactions);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getReactions = getReactions;
async function getReaction(query) {
    try {
        const reaction = await reaction_1.default.aggregate([
            { $match: query },
            memberFilters_1.memberLookup,
            {
                $unwind: {
                    path: "$reactedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        return reaction ? reaction[0] : null;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.getReaction = getReaction;
async function getReactionSummaryByBoard(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.boardId) };
        const reactionsSummary = await board_1.default.aggregate([
            { $match: query },
            sectionFilters_1.sectionsLookup,
            {
                $unwind: "$sections",
            },
            {
                $unwind: "$sections.notes",
            },
            {
                $unwind: "$sections.notes.reactions",
            },
            { $replaceRoot: { newRoot: "$sections.notes.reactions" } },
            {
                $group: {
                    _id: null,
                    plusOne: { $sum: { $cond: [{ $eq: ["$type", "plusOne"] }, 1, 0] } },
                    highlight: {
                        $sum: { $cond: [{ $eq: ["$type", "highlight"] }, 1, 0] },
                    },
                    minusOne: { $sum: { $cond: [{ $eq: ["$type", "minusOne"] }, 1, 0] } },
                    love: { $sum: { $cond: [{ $eq: ["$type", "love"] }, 1, 0] } },
                    deserve: { $sum: { $cond: [{ $eq: ["$type", "deserve"] }, 1, 0] } },
                    totalReactions: { $sum: 1 },
                },
            },
        ]);
        return res
            .status(200)
            .send(reactionsSummary ? reactionsSummary[0] : reactionsSummary);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getReactionSummaryByBoard = getReactionSummaryByBoard;
async function getReactionSummaryBySection(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.sectionId) };
        const reactionsSummary = await section_1.default.aggregate([
            { $match: query },
            noteFilters_1.notesLookup,
            {
                $unwind: "$notes",
            },
            {
                $unwind: "$notes.reactions",
            },
            { $replaceRoot: { newRoot: "$notes.reactions" } },
            {
                $group: {
                    _id: null,
                    plusOne: { $sum: { $cond: [{ $eq: ["$type", "plusOne"] }, 1, 0] } },
                    highlight: {
                        $sum: { $cond: [{ $eq: ["$type", "highlight"] }, 1, 0] },
                    },
                    minusOne: { $sum: { $cond: [{ $eq: ["$type", "minusOne"] }, 1, 0] } },
                    love: { $sum: { $cond: [{ $eq: ["$type", "love"] }, 1, 0] } },
                    deserve: { $sum: { $cond: [{ $eq: ["$type", "deserve"] }, 1, 0] } },
                    totalReactions: { $sum: 1 },
                },
            },
        ]);
        return res
            .status(200)
            .send(reactionsSummary ? reactionsSummary[0] : reactionsSummary);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getReactionSummaryBySection = getReactionSummaryBySection;
async function getReactionSummaryByNote(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.noteId) };
        const reactionsSummary = await note_2.default.aggregate([
            { $match: query },
            reactionFilters_1.reactionLookup,
            {
                $unwind: "$reactions",
            },
            { $replaceRoot: { newRoot: "$reactions" } },
            {
                $group: {
                    _id: null,
                    plusOne: { $sum: { $cond: [{ $eq: ["$type", "plusOne"] }, 1, 0] } },
                    highlight: {
                        $sum: { $cond: [{ $eq: ["$type", "highlight"] }, 1, 0] },
                    },
                    minusOne: { $sum: { $cond: [{ $eq: ["$type", "minusOne"] }, 1, 0] } },
                    love: { $sum: { $cond: [{ $eq: ["$type", "love"] }, 1, 0] } },
                    deserve: { $sum: { $cond: [{ $eq: ["$type", "deserve"] }, 1, 0] } },
                    totalReactions: { $sum: 1 },
                },
            },
        ]);
        return res
            .status(200)
            .send(reactionsSummary ? reactionsSummary[0] : reactionsSummary);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getReactionSummaryByNote = getReactionSummaryByNote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrQ0FBNkU7QUFFN0UsK0RBQXVDO0FBQ3ZDLDZEQUFxQztBQUNyQyxxRUFBNkM7QUFDN0MsbUVBQTJDO0FBQzNDLDBDQUE2QztBQUM3QyxzQ0FBc0M7QUFDdEMscUNBQTJDO0FBQzNDLDREQUF3RDtBQUN4RCx3REFBZ0M7QUFDaEMsd0RBQXFEO0FBQ3JELGdFQUE0RDtBQUM1RCw4REFBMkQ7QUFFcEQsS0FBSyxVQUFVLHNCQUFzQixDQUFDLE9BRTVDOztJQUNDLElBQUk7UUFDRiwwQkFBMEI7UUFDMUIsTUFBTSxNQUFNLEdBQVEsTUFBTSxrQkFBUyxDQUFDO1lBQ2xDLE1BQU0sRUFBRSxPQUFPLENBQUMsU0FBUztZQUN6QixRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTO1lBQzNCLENBQUMsQ0FBQztnQkFDRSxJQUFJLEVBQUU7b0JBQ0osRUFBRSxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDbkQsRUFBRSxTQUFTLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxHQUFHLENBQUMsRUFBRTtpQkFDcEQ7YUFDRjtZQUNILENBQUMsQ0FBQztnQkFDRSxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO2FBQzlCLEVBQ0wsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtnQkFDdEIsU0FBUyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0s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