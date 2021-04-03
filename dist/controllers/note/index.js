"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotePosition = exports.getNote = exports.findNotesBySectionAndDelete = exports.removeReactionFromNote = exports.addReactionToNote = exports.createNoteActivity = exports.deleteNote = exports.markNoteRead = exports.getNotesBySectionId = exports.updateNote = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const reactionFilters_1 = require("../../util/reactionFilters");
const note_1 = __importDefault(require("../../models/note"));
const noteActivity_1 = __importDefault(require("../../models/noteActivity"));
const section_1 = require("../section");
const reaction_1 = require("../reaction");
const member_1 = require("../member");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateNote(payload) {
    var _a;
    try {
        const creator = payload.createdById
            ? await member_1.getMember({
                userId: mongoose_1.default.Types.ObjectId(payload.createdById),
            })
            : null;
        const updator = payload.updatedById
            ? await member_1.getMember({
                userId: mongoose_1.default.Types.ObjectId(payload.updatedById),
            })
            : null;
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.noteId) }, update = {
            $set: {
                description: payload.description,
                sectionId: payload.sectionId,
                createdById: creator ? creator === null || creator === void 0 ? void 0 : creator._id : payload.createdById || null,
                updatedById: updator ? updator === null || updator === void 0 ? void 0 : updator._id : payload.updatedById || null,
                isAnnonymous: payload.isAnnonymous || false,
                position: payload === null || payload === void 0 ? void 0 : payload.position,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await note_1.default.findOneAndUpdate(query, update, options);
        await section_1.addNoteToSection(updated._id, payload.sectionId);
        await createNoteActivity(updated._id, "update", (_a = payload === null || payload === void 0 ? void 0 : payload.user) === null || _a === void 0 ? void 0 : _a._id);
        const note = await getNoteDetails(updated === null || updated === void 0 ? void 0 : updated._id);
        return note;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.updateNote = updateNote;
async function getNotesBySectionId(req, res) {
    try {
        const query = { sectionId: mongoose_1.default.Types.ObjectId(req.params.sectionId) };
        const notes = await note_1.default.aggregate([
            { $match: query },
            noteFilters_1.createdByLookUp,
            {
                $unwind: {
                    path: "$createdBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            noteFilters_1.updatedByLookUp,
            {
                $unwind: {
                    path: "$updatedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            reactionFilters_1.reactionLookup,
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionPlusTwoLookup,
            reactionFilters_1.reactionMinusOneLookup,
            reactionFilters_1.reactionLoveLookup,
            reactionFilters_1.reactionAddFields,
        ]);
        return res.status(200).json(notes);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getNotesBySectionId = getNotesBySectionId;
async function getNoteDetails(noteId) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(noteId) };
        const notes = await note_1.default.aggregate([
            { $match: query },
            noteFilters_1.createdByLookUp,
            {
                $unwind: {
                    path: "$createdBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            noteFilters_1.updatedByLookUp,
            {
                $unwind: {
                    path: "$updatedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            reactionFilters_1.reactionLookup,
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionPlusTwoLookup,
            reactionFilters_1.reactionMinusOneLookup,
            reactionFilters_1.reactionLoveLookup,
            reactionFilters_1.reactionAddFields,
        ]);
        return notes ? notes[0] : null;
    }
    catch (err) {
        throw err || err.message;
    }
}
async function markNoteRead(payload) {
    var _a;
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.id) }, update = {
            $set: {
                read: payload.read,
            },
        }, options = { new: true };
        const noteUpdated = await note_1.default.findOneAndUpdate(query, update, options);
        await createNoteActivity(noteUpdated._id, payload.read ? "read" : "un-read", (_a = payload === null || payload === void 0 ? void 0 : payload.user) === null || _a === void 0 ? void 0 : _a._id);
        return noteUpdated;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.markNoteRead = markNoteRead;
async function deleteNote(id, userId) {
    try {
        const deleted = deleteNoteById(id);
        if (!deleted) {
            return deleted;
        }
        await createNoteActivity(id, "delete", userId);
        return { deleted: true, _id: id };
    }
    catch (err) {
        return {
            deleted: false,
            message: err || (err === null || err === void 0 ? void 0 : err.message),
            _id: id,
        };
    }
}
exports.deleteNote = deleteNote;
async function createNoteActivity(notedId, action, userId) {
    try {
        const activity = await new noteActivity_1.default({
            userId: userId,
            notedId: notedId,
            type: "note",
            action: action,
        });
        await activity.save();
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.createNoteActivity = createNoteActivity;
async function addReactionToNote(reactionId, noteId) {
    try {
        if (!reactionId || !noteId) {
            return;
        }
        const updated = await note_1.default.findByIdAndUpdate(noteId, { $push: { reactions: reactionId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding reaction ${err || err.message}`;
    }
}
exports.addReactionToNote = addReactionToNote;
async function removeReactionFromNote(reactionId, noteId) {
    try {
        if (!reactionId || !noteId) {
            return;
        }
        await note_1.default.findByIdAndUpdate(noteId, { $pull: { reactions: reactionId } });
    }
    catch (err) {
        throw new Error("Error while removing reaction from note");
    }
}
exports.removeReactionFromNote = removeReactionFromNote;
async function findNotesBySectionAndDelete(sectionId) {
    try {
        const notesList = await getNotesBySection(sectionId);
        if (!(notesList === null || notesList === void 0 ? void 0 : notesList.length)) {
            return;
        }
        const deleted = notesList.reduce(async (promise, note) => {
            await promise;
            await reaction_1.findReactionsByNoteAndDelete(note._id);
            await deleteNoteById(note._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findNotesBySectionAndDelete = findNotesBySectionAndDelete;
async function getNote(query) {
    try {
        const note = await note_1.default.findOne(query);
        return note;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.getNote = getNote;
async function updateNotePosition(payload) {
    try {
        if (!payload) {
            return { updated: false };
        }
        const sourceNote = await getNote({
            _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.sourceId),
        });
        const destinationNote = await getNote({
            _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.destinationId),
        });
        if (sourceNote && destinationNote) {
            await note_1.default.findByIdAndUpdate(sourceNote === null || sourceNote === void 0 ? void 0 : sourceNote._id, {
                position: destinationNote === null || destinationNote === void 0 ? void 0 : destinationNote.position,
            });
        }
        if (sourceNote && destinationNote) {
            await note_1.default.findByIdAndUpdate(destinationNote === null || destinationNote === void 0 ? void 0 : destinationNote._id, {
                position: sourceNote === null || sourceNote === void 0 ? void 0 : sourceNote.position,
            });
        }
        return {
            updated: true,
        };
    }
    catch (err) {
        return {
            updated: false,
            error: err | err.message,
        };
    }
}
exports.updateNotePosition = updateNotePosition;
async function deleteNoteById(noteId) {
    try {
        if (!noteId) {
            return;
        }
        return await note_1.default.findByIdAndRemove(noteId);
    }
    catch (err) {
        throw `Error while deleting note ${err || err.message}`;
    }
}
async function getNotesBySection(sectionId) {
    try {
        if (!sectionId) {
            return;
        }
        return await note_1.default.find({ sectionId });
    }
    catch (err) {
        throw `Error while fetching notes ${err || err.message}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUEwRTtBQUMxRSxnRUFRb0M7QUFFcEMsNkRBQXFDO0FBQ3JDLDZFQUFxRDtBQUNyRCx3Q0FBOEM7QUFDOUMsMENBQTJEO0FBQzNELHNDQUFzQztBQUN0Qyx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxPQUVoQzs7SUFDQyxJQUFJO1FBQ0YsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVc7WUFDakMsQ0FBQyxDQUFDLE1BQU0sa0JBQVMsQ0FBQztnQkFDZCxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7YUFDckQsQ0FBQztZQUNKLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVztZQUNqQyxDQUFDLENBQUMsTUFBTSxrQkFBUyxDQUFDO2dCQUNkLE1BQU0sRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUNyRCxDQUFDO1lBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNULE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFDNUQsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztnQkFDaEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO2dCQUM1QixXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxJ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