"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNote = exports.findNotesBySectionAndDelete = exports.removeReactionFromNote = exports.addReactionToNote = exports.deleteNote = exports.markNoteRead = exports.getNotesBySectionId = exports.updateNote = void 0;
const reactionFilters_1 = require("../../util/reactionFilters");
const note_1 = __importDefault(require("../../models/note"));
const section_1 = require("../section");
const reaction_1 = require("../reaction");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateNote(payload) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.noteId) }, update = {
            $set: {
                description: payload.description,
                sectionId: payload.sectionId,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await note_1.default.findOneAndUpdate(query, update, options);
        await section_1.addNoteToSection(updated._id, payload.sectionId);
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
            reactionFilters_1.reactionLookup,
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionPlusTwoLookup,
            reactionFilters_1.reactionDisAgreeLookup,
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
            reactionFilters_1.reactionLookup,
            reactionFilters_1.reactionDeserveLookup,
            reactionFilters_1.reactionPlusOneLookup,
            reactionFilters_1.reactionPlusTwoLookup,
            reactionFilters_1.reactionDisAgreeLookup,
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
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.id) }, update = {
            $set: {
                read: payload.read,
            },
        }, options = { new: true };
        const noteUpdated = await note_1.default.findOneAndUpdate(query, update, options);
        return noteUpdated;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.markNoteRead = markNoteRead;
async function deleteNote(id) {
    try {
        const deleted = deleteNoteById(id);
        if (!deleted) {
            return deleted;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGdFQVFvQztBQUVwQyw2REFBcUM7QUFDckMsd0NBQThDO0FBQzlDLDBDQUEyRDtBQUMzRCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLFVBQVUsQ0FBQyxPQUVoQztJQUNDLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQzVELE1BQU0sR0FBRztZQUNQLElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7Z0JBQ2hDLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUzthQUM3QjtTQUNGLEVBQ0QsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25FLE1BQU0sT0FBTyxHQUFRLE1BQU0sY0FBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekUsTUFBTSwwQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUMzQjtBQUNILENBQUM7QUFuQkQsZ0NBbUJDO0FBRU0sS0FBSyxVQUFVLG1CQUFtQixDQUN2QyxHQUFZLEVBQ1os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