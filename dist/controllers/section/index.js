"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteToSection = exports.findSectionsByBoardAndDelete = exports.removeNoteFromSection = exports.deleteSection = exports.addAndRemoveNoteFromSection = exports.getSectionsByBoardId = exports.getSection = exports.updateSection = exports.saveSection = void 0;
const constants_1 = require("../../util/constants");
const note_1 = require("../note");
const noteFilters_1 = require("../../util/noteFilters");
const section_1 = __importDefault(require("../../models/section"));
const activity_1 = require("../activity");
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
    var _a, _b, _c;
    try {
        const sectionCount = await section_1.default.find({
            boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
        }).count();
        if (sectionCount > 10) {
            return {
                errorId: constants_1.SECTION_COUNT_EXCEEDS,
                message: `Max no of sections allowed are only 10`,
            };
        }
        const query = { _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.sectionId) }, update = {
            $set: {
                title: payload === null || payload === void 0 ? void 0 : payload.title,
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
        if (payload === null || payload === void 0 ? void 0 : payload.sectionId) {
            await activity_1.createActivity({
                userId: (_b = payload === null || payload === void 0 ? void 0 : payload.user) === null || _b === void 0 ? void 0 : _b._id,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
                title: `section`,
                primaryAction: "from",
                primaryTitle: payload === null || payload === void 0 ? void 0 : payload.previousTitle,
                secondaryAction: "to",
                secondaryTitle: updated === null || updated === void 0 ? void 0 : updated.title,
                type: "section",
                action: "update",
            });
        }
        else {
            await activity_1.createActivity({
                userId: (_c = payload === null || payload === void 0 ? void 0 : payload.user) === null || _c === void 0 ? void 0 : _c._id,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
                title: `${updated === null || updated === void 0 ? void 0 : updated.title}`,
                primaryAction: "as",
                primaryTitle: "section",
                type: "section",
                action: "create",
            });
        }
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
        const destinationSectionUpdated = await addNoteToSection(data.noteId, data.destinationSectionId);
        const sourceSectionUpdated = await removeNoteFromSection(data.noteId, data.sourceSectionId);
        await note_1.updateNoteSectionId(data.noteId, data.destinationSectionId);
        const noteDetails = await note_1.getNoteDetails(data.noteId);
        await activity_1.createActivity({
            userId: data === null || data === void 0 ? void 0 : data.userId,
            boardId: data === null || data === void 0 ? void 0 : data.boardId,
            title: `${noteDetails === null || noteDetails === void 0 ? void 0 : noteDetails.description}`,
            primaryAction: "from",
            primaryTitle: `${sourceSectionUpdated === null || sourceSectionUpdated === void 0 ? void 0 : sourceSectionUpdated.title}`,
            secondaryAction: "to",
            secondaryTitle: `${destinationSectionUpdated === null || destinationSectionUpdated === void 0 ? void 0 : destinationSectionUpdated.title}`,
            type: "note",
            action: "move",
        });
        return noteDetails;
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
            noteFilters_1.sectionNoteAddFields,
        ]);
        // socket.emit("sections-list", sections);
        return sections;
    }
    catch (err) {
        throw err | err.message;
    }
}
async function deleteSection(sectionId, userId, boardId) {
    try {
        const deleted = deleteSectionAndNotes(sectionId);
        if (!deleted) {
            return deleted;
        }
        await activity_1.createActivity({
            userId: userId,
            boardId: boardId,
            title: "section",
            type: "section",
            action: "delete",
        });
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
        const updated = await section_1.default.findByIdAndUpdate(sectionId, { $pull: { notes: noteId } }, { new: true, useFindAndModify: false });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUc4QjtBQUU5QixrQ0FJaUI7QUFDakIsd0RBSWdDO0FBRWhDLG1FQUEyQztBQUMzQywwQ0FBNkM7QUFDN0Msd0RBQWdDO0FBRXpCLEtBQUssVUFBVSxXQUFXLENBQUMsS0FBVTtJQUMxQyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU87U0FDUjtRQUNELE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxPQUFPLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzdCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQztBQVZELGtDQVVDO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FBQyxPQUVuQzs7SUFDQyxJQUFJO1FBQ0YsTUFBTSxZQUFZLEdBQVcsTUFBTSxpQkFBTyxDQUFDLElBQUksQ0FBQztZQUM5QyxPQUFPLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU87U0FDMUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1gsSUFBSSxZQUFZLEdBQUcsRUFBRSxFQUFFO1lBQ3JCLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLGlDQUFxQjtnQkFDOUIsT0FBTyxFQUFFLHdDQUF3QzthQUNsRCxDQUFDO1NBQ0g7UUFDRCxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQ2hFLE1BQU0sR0FBRztZQUNQLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsT0FBTyxhQUFQLE9BQU8s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