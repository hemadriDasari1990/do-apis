"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNotesBySectionAndDelete = exports.addReactionToNote = exports.deleteNote = exports.markReadNote = exports.getNotesBySectionId = exports.updateNote = void 0;
const reactionFilters_1 = require("../../util/reactionFilters");
const note_1 = __importDefault(require("../../models/note"));
const section_1 = require("../section");
const reaction_1 = require("../reaction");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../index");
async function updateNote(req, res, next) {
    try {
        const update = {
            description: req.body.description,
            sectionId: req.body.sectionId,
        };
        const options = { upsert: true, new: true };
        const updated = await note_1.default.findByIdAndUpdate(req.body.noteId ? req.body.noteId : new mongoose_1.default.Types.ObjectId(), update, options);
        if (!updated) {
            return next(updated);
        }
        const added = await section_1.addNoteToSection(updated._id, req.body.sectionId);
        if (!added) {
            return next(added);
        }
        const note = await getNoteDetails(updated === null || updated === void 0 ? void 0 : updated._id);
        index_1.socket.emit(`update-note-${note === null || note === void 0 ? void 0 : note.sectionId}`, note);
        return res.status(200).send(note);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
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
async function markReadNote(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) }, update = {
            $set: {
                read: req.body.read,
            },
        };
        const noteUpdated = await note_1.default.findOneAndUpdate(query, update);
        if (!noteUpdated) {
            res.status(500).json({ message: `Cannot Update note` });
            return next(noteUpdated);
        }
        noteUpdated.read = req.body.read;
        await index_1.socket.emit(`mark-read-${noteUpdated === null || noteUpdated === void 0 ? void 0 : noteUpdated.sectionId}`, noteUpdated);
        return res.status(200).send(noteUpdated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.markReadNote = markReadNote;
async function deleteNote(req, res, next) {
    try {
        const noteDeleted = await deleteNoteById(req.params.id);
        if (!noteDeleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(noteDeleted);
        }
        index_1.socket.emit(`delete-note-${noteDeleted === null || noteDeleted === void 0 ? void 0 : noteDeleted.sectionId}`, noteDeleted);
        return res.status(200).send(noteDeleted);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
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
        throw `Error adding like ${err || err.message}`;
    }
}
exports.addReactionToNote = addReactionToNote;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGdFQVFvQztBQUVwQyw2REFBcUM7QUFDckMsd0NBQThDO0FBQzlDLDBDQUEyRDtBQUMzRCx3REFBZ0M7QUFDaEMsdUNBQXFDO0FBRTlCLEtBQUssVUFBVSxVQUFVLENBQzlCLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHO1lBQ2IsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVztZQUNqQyxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTO1NBQzlCLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQzVDLE1BQU0sT0FBTyxHQUFRLE1BQU0sY0FBSSxDQUFDLGlCQUFpQixDQUMvQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQ2pFLE1BQU0sRUFDTixPQUFPLENBQ1IsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sMEJBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQjtRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sY0FBYyxD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