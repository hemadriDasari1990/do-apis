"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteToSection = exports.findSectionsByBoardAndDelete = exports.removeNoteFromSection = exports.deleteSection = exports.addAndRemoveNoteFromSection = exports.getSectionsByBoardId = exports.getSection = exports.updateSection = exports.saveSection = void 0;
const noteFilters_1 = require("../../util/noteFilters");
const constants_1 = require("../../util/constants");
const section_1 = __importDefault(require("../../models/section"));
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
async function deleteSection(sectionId) {
    try {
        const deleted = deleteSectionAndNotes(sectionId);
        if (!deleted) {
            return deleted;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdEQUFvRTtBQUVwRSxvREFBK0Q7QUFDL0QsbUVBQTJDO0FBQzNDLGtDQUFzRDtBQUN0RCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLFdBQVcsQ0FBQyxLQUFVO0lBQzFDLElBQUk7UUFDRixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDN0I7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sR0FBRyxDQUFDO0tBQ1g7QUFDSCxDQUFDO0FBVkQsa0NBVUM7QUFFTSxLQUFLLFVBQVUsYUFBYSxDQUFDLE9BRW5DO0lBQ0MsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxDQUFDLEVBQUUsRUFDaEUsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSztnQkFDckIsV0FBVyxFQUFFLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxXQUFXO2dCQUNqQyxPQUFPLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU87YUFDMUI7U0FDRixFQUNELE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUNuRSxNQUFNLE9BQU8sR0FBRyxNQUFNLFVBQVUsQ0FBQztZQUMvQixJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU8sRUFBRSxDQUFDO1NBQ2pFLENBQUMsQ0FBQztRQUNILElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTztnQkFDTCxPQUFPLEVBQUUsbUNBQXVCO2dCQUNoQyxPQUFPLEVBQUUsZ0JBQWdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxLQUFLLDhDQUE4QzthQUN0RixDQUFDO1NBQ0g7UUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RSxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUM7S0FDWjtBQUNILENBQUM7QUEzQkQsc0NBMkJDO0FBRU0sS0FBSyxVQUFVLFVBQVUsQ0FBQyxLQUE2QjtJQUM1RCxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxpQkFBTyxDQUFDLFNBQVMsQ0FBQztZQUN2QyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDakIseUJBQVc7WUFDWCwyQkFBYTtTQUNkLENBQUMsQ0FBQztRQUNILE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUN0QztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUMxQjtBQUNILENBQUM7QUFYRCxnQ0FXQztBQUVNLEtBQUssVUFBVSxvQkFBb0IsQ0FDeEMsR0FBWSxFQUNaLEdBQWE7SUFFYixJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZDO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBVkQsb0RBVUM7QUFFTSxLQUFLLFVBQVUsMkJBQTJCLENBQUMsSUFFakQ7SUFDQyxJQUFJO1FBQ0YsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sT0FBTyxHQUFHLE1BQU0scUJBQXFCLENBQ3pDLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLGVBQWUsQ0FDckIsQ0FBQztRQUNGLE9BQU8sT0FBTyxDQUFDO0tBQ2hCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQzFCO0FBQ0gsQ0FBQztBQWJELGtFQWFDO0FBRUQsS0FBSyxVQUFVLFdBQVcsQ0FBQyxPQUFlO0lBQ3hDLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLE9BQU8sRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUM1RCxNQUFNLFFBQVEsR0FBRyxNQUFNLGlCQUFPLENBQUMsU0FBUyxDQUFDO1lBQ3ZDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNqQix5QkFBVztZQUNYLDJCQUFhO1NBQ2QsQ0FBQyxDQUFDO1FBQ0gsMENBQTBDO1FBQzFDLE9BQU8sUUFBUSxDQUFDO0tBQ2pCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQ3pCO0FBQ0gsQ0FBQztBQUVNLEtBQUssVUFBVSxhQUFhLENBQUMsU0FBaUI7SUFDbkQsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLE9BQU8sQ0FBQztTQUNoQjtRQUNELE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQztLQUMxQztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTztZQUNMLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFFLEdBQUcsS0FBSSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsT0FBTyxDQUFBO1lBQzVCLEdBQUcsRUFBRSxTQUFTO1NBQ2YsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQWRELHNDQWNDO0FBRUQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLFNBQWlCO0lBQ3BELElBQUk7UUFDRixNQUFNLGtDQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzRCxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxxREFBcUQsR0FBRztZQUM1RCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBRU0sS0FBSyxVQUFVLHFCQUFxQixDQUN6QyxNQUFjLEVBQ2QsU0FBaUI7SUFFakIsSUFBSTtRQUNGLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxpQkFBTyxDQUFDLGlCQUFpQixDQUM3QyxTQUFTLEVBQ1QsRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDNUIseUNBQXlDO1NBQzFDLENBQUM7UUFDRixPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSwwQ0FBMEMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0RTtBQUNILENBQUM7QUFqQkQsc0RBaUJDO0FBRU0sS0FBSyxVQUFVLDRCQUE0QixDQUNoRCxPQUFlO0lBRWYsSUFBSTtRQUNGLE1BQU0sWUFBWSxHQUFHLE1BQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELElBQUksRUFBQyxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsTUFBTSxDQUFBLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FDakMsS0FBSyxFQUFFLE9BQXFCLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1lBQy9ELE1BQU0sT0FBTyxDQUFDO1lBQ2QsTUFBTSxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxFQUNELENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQ3BCLENBQUM7UUFDRixPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUMxQjtBQUNILENBQUM7QUFuQkQsb0VBbUJDO0FBRU0sS0FBSyxVQUFVLGdCQUFnQixDQUNwQyxNQUFjLEVBQ2QsU0FBaUI7SUFFakIsSUFBSTtRQUNGLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxpQkFBTyxDQUFDLGlCQUFpQixDQUM3QyxTQUFTLEVBQ1QsRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFDNUIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUN2QyxDQUFDO1FBQ0YsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sc0NBQXNDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbEU7QUFDSCxDQUFDO0FBakJELDRDQWlCQyJ9