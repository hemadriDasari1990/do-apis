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
    var _a, _b;
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.sectionId) }, update = {
            $set: {
                title: payload === null || payload === void 0 ? void 0 : payload.title,
                description: payload === null || payload === void 0 ? void 0 : payload.description,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const section = await getSection({
            $and: [{ title: (_a = payload === null || payload === void 0 ? void 0 : payload.title) === null || _a === void 0 ? void 0 : _a.trim() }, { boardId: payload === null || payload === void 0 ? void 0 : payload.boardId }],
        });
        if (section) {
            return {
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Section with ${section === null || section === void 0 ? void 0 : section.title} already exist. Please choose different name`,
            };
        }
        const updated = await section_1.default.findOneAndUpdate(query, update, options);
        await createSectionActivity(updated._id, "update", (_b = payload === null || payload === void 0 ? void 0 : payload.user) === null || _b === void 0 ? void 0 : _b._id);
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