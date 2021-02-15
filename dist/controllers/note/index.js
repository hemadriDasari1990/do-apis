"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNotesBySectionAndDelete = exports.addReactionToNote = exports.deleteNote = exports.getNotesBySectionId = exports.updateNote = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const note_1 = __importDefault(require("../../models/note"));
const section_1 = require("../section");
const reaction_1 = require("../reaction");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../index");
async function updateNote(req, res, next) {
    try {
        const update = {
            description: req.body.description,
            sectionId: req.body.sectionId
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
;
async function getNotesBySectionId(req, res) {
    try {
        const query = { sectionId: mongoose_1.default.Types.ObjectId(req.params.sectionId) };
        const notes = await note_1.default.aggregate([
            { "$match": query },
            noteFilters_1.reactionLookup,
            noteFilters_1.reactionDeserveLookup,
            noteFilters_1.reactionPlusOneLookup,
            noteFilters_1.reactionPlusTwoLookup,
            noteFilters_1.reactionDisAgreeLookup,
            noteFilters_1.reactionLoveLookup,
            noteFilters_1.noteAddFields
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
            { "$match": query },
            noteFilters_1.reactionLookup,
            noteFilters_1.reactionDeserveLookup,
            noteFilters_1.reactionPlusOneLookup,
            noteFilters_1.reactionPlusTwoLookup,
            noteFilters_1.reactionDisAgreeLookup,
            noteFilters_1.reactionLoveLookup,
            noteFilters_1.noteAddFields
        ]);
        return notes ? notes[0] : null;
        ;
    }
    catch (err) {
        throw err || err.message;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQVFnQztBQUVoQyw2REFBcUM7QUFDckMsd0NBQThDO0FBQzlDLDBDQUEyRDtBQUMzRCx3REFBZ0M7QUFDaEMsdUNBQXFDO0FBRTlCLEtBQUssVUFBVSxVQUFVLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM5RSxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUc7WUFDYixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7U0FDOUIsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQVEsTUFBTSxjQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQyxJQUFJLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNySSxJQUFHLENBQUMsT0FBTyxFQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FBQztRQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLDBCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFHLENBQUMsS0FBSyxFQUFDO1lBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FB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