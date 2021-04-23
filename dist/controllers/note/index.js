"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotePosition = exports.getNote = exports.findNotesBySectionAndDelete = exports.removeReactionFromNote = exports.updateNoteSectionId = exports.addReactionToNote = exports.deleteNote = exports.markNoteRead = exports.getNoteDetails = exports.getNotesBySectionId = exports.updateNote = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const reactionFilters_1 = require("../../util/reactionFilters");
const note_1 = __importDefault(require("../../models/note"));
const section_1 = __importDefault(require("../../models/section"));
const section_2 = require("../section");
const activity_1 = require("../activity");
const reaction_1 = require("../reaction");
const member_1 = require("../member");
const mongoose_1 = __importDefault(require("mongoose"));
const sectionFilters_1 = require("../../util/sectionFilters");
async function updateNote(payload) {
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
            },
            $inc: { position: 1 },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await note_1.default.findOneAndUpdate(query, update, options);
        const sectionUpdated = await section_2.addNoteToSection(updated._id, payload.sectionId);
        if (payload.noteId) {
            await activity_1.createActivity({
                userId: payload === null || payload === void 0 ? void 0 : payload.userId,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
                title: `${payload.previousDescription}`,
                primaryAction: "to",
                primaryTitle: `${payload.description}`,
                secondaryAction: "under",
                secondaryTitle: sectionUpdated === null || sectionUpdated === void 0 ? void 0 : sectionUpdated.title,
                type: "note",
                action: "update",
            });
        }
        else {
            await activity_1.createActivity({
                userId: payload === null || payload === void 0 ? void 0 : payload.userId,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
                title: `${payload.description}`,
                primaryAction: "under",
                primaryTitle: sectionUpdated === null || sectionUpdated === void 0 ? void 0 : sectionUpdated.title,
                type: "note",
                action: "create",
            });
        }
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
            sectionFilters_1.sectionLookup,
            {
                $unwind: {
                    path: "$section",
                    preserveNullAndEmptyArrays: true,
                },
            },
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
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.id) }, update = {
            $set: {
                read: payload.read,
            },
        }, options = { new: true };
        const noteUpdated = await note_1.default.findOneAndUpdate(query, update, options);
        await activity_1.createActivity({
            boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
            userId: payload === null || payload === void 0 ? void 0 : payload.userId,
            title: ` ${noteUpdated === null || noteUpdated === void 0 ? void 0 : noteUpdated.description}`,
            primaryAction: "as",
            primaryTitle: payload.read ? "read" : "un read",
            type: "note",
            action: payload.read ? "read" : "un-read",
        });
        return noteUpdated;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.markNoteRead = markNoteRead;
async function deleteNote(payload) {
    try {
        const deleted = deleteNoteById(payload === null || payload === void 0 ? void 0 : payload.id);
        if (!deleted) {
            return deleted;
        }
        const section = await section_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.sectionId);
        await activity_1.createActivity({
            userId: payload === null || payload === void 0 ? void 0 : payload.userId,
            boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
            title: `${payload === null || payload === void 0 ? void 0 : payload.description}`,
            primaryAction: "under",
            primaryTitle: section === null || section === void 0 ? void 0 : section.title,
            type: "note",
            action: "delete",
        });
        return { deleted: true, _id: payload === null || payload === void 0 ? void 0 : payload.id, sectionId: payload === null || payload === void 0 ? void 0 : payload.sectionId };
    }
    catch (err) {
        return {
            deleted: false,
            message: err || (err === null || err === void 0 ? void 0 : err.message),
            _id: payload === null || payload === void 0 ? void 0 : payload.id,
            sectionId: payload === null || payload === void 0 ? void 0 : payload.sectionId,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ub3RlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUEwRTtBQUMxRSxnRUFPb0M7QUFFcEMsNkRBQXFDO0FBQ3JDLG1FQUEyQztBQUMzQyx3Q0FBOEM7QUFDOUMsMENBQTZDO0FBQzdDLDBDQUEyRDtBQUMzRCxzQ0FBc0M7QUFDdEMsd0RBQWdDO0FBQ2hDLDhEQUEwRDtBQUVuRCxLQUFLLFVBQVUsVUFBVSxDQUFDLE9BRWhDO0lBQ0MsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXO1lBQ2pDLENBQUMsQ0FBQyxNQUFNLGtCQUFTLENBQUM7Z0JBQ2QsTUFBTSxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ3JELENBQUM7WUFDSixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1QsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVc7WUFDakMsQ0FBQyxDQUFDLE1BQU0sa0JBQVMsQ0FBQztnQkFDZCxNQUFNLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7YUFDckQsQ0FBQztZQUNKLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVCxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQzVELE1BQU0sR0FBRztZQUNQLElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7Z0JBQ2hDLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztnQkFDNUIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEdBQUcsQ0FBQyxD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