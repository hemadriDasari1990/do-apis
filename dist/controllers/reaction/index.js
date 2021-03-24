"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReaction = exports.findReactionsByNoteAndDelete = exports.createOrUpdateReaction = void 0;
const note_1 = require("../note");
const memberFilters_1 = require("../../util/memberFilters");
const reaction_1 = __importDefault(require("../../models/reaction"));
const mongoose_1 = __importDefault(require("mongoose"));
const member_1 = require("../member");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrQ0FBNkU7QUFDN0UsNERBQXdEO0FBRXhELHFFQUE2QztBQUM3Qyx3REFBZ0M7QUFDaEMsc0NBQXNDO0FBRS9CLEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxPQUU1Qzs7SUFDQyxJQUFJO1FBQ0YsMEJBQTBCO1FBQzFCLE1BQU0sTUFBTSxHQUFRLE1BQU0sa0JBQVMsQ0FBQztZQUNsQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDekIsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUztZQUMzQixDQUFDLENBQUM7Z0JBQ0UsSUFBSSxFQUFFO29CQUNKLEVBQUUsTUFBTSxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ25ELEVBQUUsU0FBUyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsR0FBRyxDQUFDLEVBQUU7aUJBQ3BEO2FBQ0Y7WUFDSCxDQUFDLENBQUM7Z0JBQ0UsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTthQUM5QixFQUNMLE1BQU0sR0FBRztZQUNQLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3RCLFNBQVMsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsR0FBRztnQkFDdEIsSUFBSSxFQUFFLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxJQUFJO2FBQ3BCO1NBQ0YsRUFDRCxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUs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