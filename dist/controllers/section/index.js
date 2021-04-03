"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteToSection = exports.findSectionsByBoardAndDelete = exports.removeNoteFromSection = exports.deleteSection = exports.addAndRemoveNoteFromSection = exports.getSectionsByBoardId = exports.createSectionActivity = exports.getSection = exports.updateSection = exports.saveSection = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const constants_1 = require("../../util/constants");
const section_1 = __importDefault(require("../../models/section"));
const sectionActivity_1 = __importDefault(require("../../models/sectionActivity"));
const note_1 = require("../note");
const mongoose_1 = __importDefault(require("mongoose"));
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
async function updateSection(payload) {
    var _a;
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.sectionId) }, update = {
            $set: {
                title: payload === null || payload === void 0 ? void 0 : payload.title,
                description: payload === null || payload === void 0 ? void 0 : payload.description,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const section = await getSection({
            $and: [{ title: payload === null || payload === void 0 ? void 0 : payload.title }, { boardId: payload === null || payload === void 0 ? void 0 : payload.boardId }],
        });
        if (section) {
            return {
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Section with ${section === null || section === void 0 ? void 0 : section.title} already exist. Please choose different name`,
            };
        }
        const updated = await section_1.default.findOneAndUpdate(query, update, options);
        await createSectionActivity(updated._id, "update", (_a = payload === null || payload === void 0 ? void 0 : payload.user) === null || _a === void 0 ? void 0 : _a._id);
        return updated;
    }
    catch (err) {
        return err;
    }
}
exports.updateSection = updateSection;
async function getSection(query) {
    try {
        const sections = await section_1.default.aggregate([
            { $match: query },
            noteFilters_1.notesLookup,
            noteFilters_1.noteAddFields,
        ]);
        return sections ? sections[0] : null;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.getSection = getSection;
async function createSectionActivity(sectionId, action, userId) {
    try {
        const activity = await new sectionActivity_1.default({
            userId: userId,
            sectionId: sectionId,
            type: "section",
            action: action,
        });
        await activity.save();
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.createSectionActivity = createSectionActivity;
async function getSectionsByBoardId(req, res) {
    try {
        const sections = await getSections(req.params.boardId);
        return res.status(200).json(sections);
    }
    catch (err) {
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
async function deleteSection(sectionId, userId) {
    try {
        const deleted = deleteSectionAndNotes(sectionId);
        if (!deleted) {
            return deleted;
        }
        await createSectionActivity(deleted._id, "delete", userId);
        return { deleted: true, _id: sectionId };
    }
    catch (err) {
        return {
            deleted: false,
            message: err || (err === null || err === void 0 ? void 0 : err.message),
            _id: sectionId,
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUFvRTtBQUVwRSxvREFBK0Q7QUFDL0QsbUVBQTJDO0FBQzNDLG1GQUEyRDtBQUMzRCxrQ0FBc0Q7QUFDdEQsd0RBQWdDO0FBRXpCLEtBQUssVUFBVSxXQUFXLENBQUMsS0FBVTtJQUMxQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU87U0FDUjtRQUNELE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxPQUFPLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzdCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQztBQVZELGtDQVVDO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FBQyxPQUVuQzs7SUFDQyxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLENBQUMsRUFBRSxFQUNoRSxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxLQUFLO2dCQUNyQixXQUFXLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFdBQVc7Z0JBQ2pDLE9BQU8sRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsT0FBTzthQUMxQjtTQUNGLEVBQ0QsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25FLE1B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