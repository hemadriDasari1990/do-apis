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
const index_1 = require("../../index");
const member_1 = require("../member");
async function createOrUpdateReaction(req, res) {
    var _a, _b, _c, _d, _e, _f;
    try {
        /* Get the admin member */
        const member = await member_1.getMember({
            userId: req.body.reactedBy,
            isAuthor: true,
            isVerified: true,
        });
        const query = req.body.reactedBy
            ? {
                $and: [
                    { noteId: mongoose_1.default.Types.ObjectId(req.body.noteId) },
                    { reactedBy: mongoose_1.default.Types.ObjectId(member === null || member === void 0 ? void 0 : member._id) },
                ],
            }
            : {
                reactedBy: { $exists: false },
            }, update = {
            $set: {
                noteId: req.body.noteId,
                reactedBy: member === null || member === void 0 ? void 0 : member._id,
                type: (_a = req.body) === null || _a === void 0 ? void 0 : _a.type,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const note = await note_1.getNote({
            _id: mongoose_1.default.Types.ObjectId((_b = req.body) === null || _b === void 0 ? void 0 : _b.noteId),
        });
        const reactionDetails = await getReaction({
            $and: [
                { reactedBy: mongoose_1.default.Types.ObjectId(member === null || member === void 0 ? void 0 : member._id) },
                { noteId: mongoose_1.default.Types.ObjectId(req.body.noteId) },
            ],
        });
        /* Remove only if member is known */
        if (reactionDetails &&
            req.body.reactedBy &&
            (reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails.type) === ((_c = req.body) === null || _c === void 0 ? void 0 : _c.type)) {
            if ((_d = note === null || note === void 0 ? void 0 : note.reactions) === null || _d === void 0 ? void 0 : _d.includes(reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails._id)) {
                await note_1.removeReactionFromNote(reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails._id, (_e = req.body) === null || _e === void 0 ? void 0 : _e.noteId);
            }
            await removeReactionById(reactionDetails === null || reactionDetails === void 0 ? void 0 : reactionDetails._id);
            await index_1.socket.emit(`new-reaction-${req.body.noteId}`, Object.assign({ removed: true }, reactionDetails));
            return res.status(200).send(Object.assign({ removed: true }, reactionDetails));
        }
        const reactionUpdated = await updateReaction(query, update, options);
        if (!reactionUpdated) {
            return res.status(500).send("Error while updating reaction");
        }
        const newReaction = await getReaction({
            _id: mongoose_1.default.Types.ObjectId(reactionUpdated === null || reactionUpdated === void 0 ? void 0 : reactionUpdated._id),
        });
        if (!((_f = note === null || note === void 0 ? void 0 : note.reactions) === null || _f === void 0 ? void 0 : _f.includes(newReaction === null || newReaction === void 0 ? void 0 : newReaction._id))) {
            const added = await note_1.addReactionToNote(newReaction._id, req.body.noteId);
            await index_1.socket.emit(`new-reaction-${added === null || added === void 0 ? void 0 : added._id}`, newReaction);
        }
        await index_1.socket.emit(`new-reaction-${note === null || note === void 0 ? void 0 : note._id}`, newReaction);
        return res.status(200).send(newReaction);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxrQ0FBNkU7QUFDN0UsNERBQXdEO0FBRXhELHFFQUE2QztBQUM3Qyx3REFBZ0M7QUFDaEMsdUNBQXFDO0FBQ3JDLHNDQUFzQztBQUUvQixLQUFLLFVBQVUsc0JBQXNCLENBQzFDLEdBQVksRUFDWixHQUFhOztJQUViLElBQUk7UUFDRiwwQkFBMEI7UUFDMUIsTUFBTSxNQUFNLEdBQVEsTUFBTSxrQkFBUyxDQUFDO1lBQ2xDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDMUIsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDNUIsQ0FBQyxDQUFDO2dCQUNFLElBQUksRUFBRTtvQkFDSixFQUFFLE1BQU0sRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDcEQsRUFBRSxTQUFTLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxHQUFHLENBQUMsRUFBRTtpQkFDcEQ7YUFDRjtZQUNILENBQUMsQ0FBQztnQkFDRSxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO2FBQzlCLEVBQ0wsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ3ZCLFNBQVMsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsR0FBRztnQkFDdEIsSUFBSSxRQUFFLEdBQUcsQ0FBQyxJQUFJ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