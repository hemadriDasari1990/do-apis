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
                    plusTwo: { $sum: { $cond: [{ $eq: ["$type", "plusTwo"] }, 1, 0] } },
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
                    plusTwo: { $sum: { $cond: [{ $eq: ["$type", "plusTwo"] }, 1, 0] } },
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
                    plusTwo: { $sum: { $cond: [{ $eq: ["$type", "plusTwo"] }, 1, 0] } },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrQ0FBNkU7QUFFN0UsK0RBQXVDO0FBQ3ZDLDZEQUFxQztBQUNyQyxxRUFBNkM7QUFDN0MsbUVBQTJDO0FBQzNDLHNDQUFzQztBQUN0QyxxQ0FBMkM7QUFDM0MsNERBQXdEO0FBQ3hELHdEQUFnQztBQUNoQyx3REFBcUQ7QUFDckQsZ0VBQTREO0FBQzVELDhEQUEyRDtBQUVwRCxLQUFLLFVBQVUsc0JBQXNCLENBQUMsT0FFNUM7O0lBQ0MsSUFBSTtRQUNGLDBCQUEwQjtRQUMxQixNQUFNLE1BQU0sR0FBUSxNQUFNLGtCQUFTLENBQUM7WUFDbEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxTQUFTO1lBQ3pCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVM7WUFDM0IsQ0FBQyxDQUFDO2dCQUNFLElBQUksRUFBRTtvQkFDSixFQUFFLE1BQU0sRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNuRCxFQUFFLFNBQVMsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLEdBQUcsQ0FBQyxFQUFFO2lCQUNwRDthQUNGO1lBQ0gsQ0FBQyxDQUFDO2dCQUNFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7YUFDOUIsRUFDTCxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2dCQUN0QixTQUFTLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLEdBQUc7Z0JB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