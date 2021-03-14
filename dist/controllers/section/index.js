"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteToSection = exports.removeNoteFromSection = exports.deleteSection = exports.addAndRemoveNoteFromSection = exports.getSectionsByBoardId = exports.updateSection = exports.saveSection = exports.createSection = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const section_1 = __importDefault(require("../../models/section"));
const note_1 = require("../note");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../index");
async function createSection(req, res, next) {
    try {
        const created = await saveSection(req.body);
        if (!created) {
            return next(created);
        }
        index_1.socket.emit("new-section", created);
        return res.status(200).send("Title created Successfully");
    }
    catch (err) {
        throw new Error(err || err.message);
    }
}
exports.createSection = createSection;
async function saveSection(input) {
    try {
        if (!input) {
            return;
        }
        const section = new section_1.default(input);
        return await section.save();
    }
    catch (err) {
        throw err;
    }
}
exports.saveSection = saveSection;
async function updateSection(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.sectionId) }, update = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                projectId: req.body.projectId,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await section_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        index_1.socket.emit("update-section", updated);
        // await addDepartmentToOrganization(updated?._id, req.body.organizationId);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateSection = updateSection;
async function getSectionsByBoardId(req, res) {
    try {
        const sections = await getSections(req.params.boardId);
        return res.status(200).json(sections);
    }
    catch (err) {
        console.log("error", err);
        return res.status(500).send(err || err.message);
    }
}
exports.getSectionsByBoardId = getSectionsByBoardId;
async function addAndRemoveNoteFromSection(data) {
    try {
        await addNoteToSection(data.noteId, data.destinationSectionId);
        const updated = await removeNoteFromSection(data.noteId, data.sourceSectionId);
        return updated;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.addAndRemoveNoteFromSection = addAndRemoveNoteFromSection;
async function getSections(boardId) {
    try {
        const query = { boardId: mongoose_1.default.Types.ObjectId(boardId) };
        const sections = await section_1.default.aggregate([
            { $match: query },
            noteFilters_1.notesLookup,
            noteFilters_1.noteAddFields,
        ]);
        // socket.emit("sections-list", sections);
        return sections;
    }
    catch (err) {
        throw err | err.message;
    }
}
async function deleteSection(req, res, next) {
    try {
        await note_1.findNotesBySectionAndDelete(req.params.id);
        const deleted = await section_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        index_1.socket.emit("delete-section", deleted);
        return res.status(200).send(deleted);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteSection = deleteSection;
async function removeNoteFromSection(noteId, sectionId) {
    try {
        if (!noteId || !sectionId) {
            return;
        }
        const updated = await section_1.default.findByIdAndUpdate(sectionId, { $pull: { notes: noteId } }
        // { new: true, useFindAndModify: false }
        );
        return updated;
    }
    catch (err) {
        throw `Error while removing note from section ${err || err.message}`;
    }
}
exports.removeNoteFromSection = removeNoteFromSection;
async function addNoteToSection(noteId, sectionId) {
    try {
        if (!noteId || !sectionId) {
            return;
        }
        const updated = await section_1.default.findByIdAndUpdate(sectionId, { $push: { notes: noteId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding note to section ${err || err.message}`;
    }
}
exports.addNoteToSection = addNoteToSection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUFvRTtBQUVwRSxtRUFBMkM7QUFDM0Msa0NBQXNEO0FBQ3RELHdEQUFnQztBQUNoQyx1Q0FBcUM7QUFFOUIsS0FBSyxVQUFVLGFBQWEsQ0FDakMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixJQUFJO1FBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELGNBQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztLQUMzRDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQWZELHNDQWVDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxLQUFVO0lBQzFDLElBQUk7UUFDRixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDN0I7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sR0FBRyxDQUFDO0tBQ1g7QUFDSCxDQUFDO0FBVkQsa0NBVUM7QUFFTSxLQUFLLFVBQVUsYUFBYSxDQUNqQyxHQUFZLEVBQ1os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