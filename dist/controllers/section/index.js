"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteToSection = exports.findSectionsByBoardAndDelete = exports.removeNoteFromSection = exports.deleteSection = exports.addAndRemoveNoteFromSection = exports.getSectionsByBoardId = exports.updateSection = exports.saveSection = exports.createSection = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const constants_1 = require("../../util/constants");
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
        const section = await getSection({
            $and: [{ title: req.body.title }, { userId: req.body.userId }],
        });
        if (section) {
            return res.status(409).json({
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Section with ${section === null || section === void 0 ? void 0 : section.title} already exist. Please choose different name`,
            });
        }
        const updated = await section_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        index_1.socket.emit("update-section", updated);
        // await addDepartmentToUser(updated?._id, req.body.userId);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateSection = updateSection;
async function getSection(query) {
    try {
        const section = await section_1.default.findOne(query);
        return section;
    }
    catch (err) {
        throw err | err.message;
    }
}
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
        const deleted = deleteSectionAndNotes(req.params.id);
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
async function deleteSectionAndNotes(sectionId) {
    try {
        await note_1.findNotesBySectionAndDelete(sectionId);
        const deleted = await section_1.default.findByIdAndRemove(sectionId);
        return deleted;
    }
    catch (err) {
        throw `Error while deleting section and notes associated ${err ||
            err.message}`;
    }
}
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
async function findSectionsByBoardAndDelete(boardId) {
    try {
        const sectionsList = await getSections(boardId);
        if (!(sectionsList === null || sectionsList === void 0 ? void 0 : sectionsList.length)) {
            return;
        }
        const deleted = sectionsList.reduce(async (promise, section) => {
            await promise;
            await deleteSectionAndNotes(section._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findSectionsByBoardAndDelete = findSectionsByBoardAndDelete;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUFvRTtBQUVwRSxvREFBK0Q7QUFDL0QsbUVBQTJDO0FBQzNDLGtDQUFzRDtBQUN0RCx3REFBZ0M7QUFDaEMsdUNBQXFDO0FBRTlCLEtBQUssVUFBVSxhQUFhLENBQ2pDLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7UUFDRCxjQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7S0FDM0Q7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNyQztBQUNILENBQUM7QUFmRCxzQ0FlQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQUMsS0FBVTtJQUMxQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU87U0FDUjtRQUNELE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxPQUFPLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzdCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQztBQVZELGtDQVVDO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FD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