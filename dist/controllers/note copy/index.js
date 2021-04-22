"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotePosition = exports.getNote = exports.findNotesBySectionAndDelete = exports.removeReactionFromNote = exports.updateNoteSectionId = exports.addReactionToNote = exports.createNoteActivity = exports.deleteNote = exports.markNoteRead = exports.getNoteDetails = exports.getNotesBySectionId = exports.updateNote = void 0;
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
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionHighlightLookup,
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
            reactionFilters_1.reactionHighlightLookup,
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
exports.getNoteDetails = getNoteDetails;
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
async function deleteNote(id, userId, sectionId) {
    try {
        const deleted = deleteNoteById(id);
        if (!deleted) {
            return deleted;
        }
        await createNoteActivity(id, "delete", userId);
        return { deleted: true, _id: id, sectionId };
    }
    catch (err) {
        return {
            deleted: false,
            message: err || (err === null || err === void 0 ? void 0 : err.message),
            _id: id,
            sectionId,
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
async function updateNoteSectionId(noteId, sectionId) {
    try {
        if (!noteId || !sectionId) {
            return;
        }
        const updated = await note_1.default.findByIdAndUpdate(noteId, {
            sectionId: sectionId,
        });
        return updated;
    }
    catch (err) {
        throw `Error while updating new section ${err || err.message}`;
    }
}
exports.updateNoteSectionId = updateNoteSectionId;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlIGNvcHkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0RBQTBFO0FBQzFFLGdFQVFvQztBQUVwQyw2REFBcUM7QUFDckMsNkVBQXFEO0FBQ3JELHdDQUE4QztBQUM5QywwQ0FBMkQ7QUFDM0Qsc0NBQXNDO0FBQ3RDLHdEQUFnQztBQUV6QixLQUFLLFVBQVUsVUFBVSxDQUFDLE9BRWhDOztJQUNDLElBQUk7UUFDRixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVztZQUNqQyxDQUFDLENBQUMsTUFBTSxrQkFBUyxDQUFDO2dCQUNkLE1BQU0sRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUNyRCxDQUFDO1lBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNULE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXO1lBQ2pDLENBQUMsQ0FBQyxNQUFNLGtCQUFTLENBQUM7Z0JBQ2QsTUFBTSxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ3JELENBQUM7WUFDSixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1QsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUM1RCxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO2dCQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7Z0JBQzVCLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxX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