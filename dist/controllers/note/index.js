"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNotesBySectionAndDelete = exports.addReactionToNote = exports.deleteNote = exports.markReadNote = exports.getNotesBySectionId = exports.updateNote = void 0;
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
async function markReadNote(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) }, update = { $set: {
                read: req.body.read,
            } };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQVFnQztBQUVoQyw2REFBcUM7QUFDckMsd0NBQThDO0FBQzlDLDBDQUEyRDtBQUMzRCx3REFBZ0M7QUFDaEMsdUNBQXFDO0FBRTlCLEtBQUssVUFBVSxVQUFVLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtJQUM5RSxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUc7WUFDYixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7U0FDOUIsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQVEsTUFBTSxjQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQyxJQUFJLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNySSxJQUFHLENBQUMsT0FBTyxFQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FBQztRQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLDBCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RSxJQUFHLENBQUMsS0FBSyxFQUFDO1lBQ1IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FB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