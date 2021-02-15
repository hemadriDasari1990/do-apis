"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNoteToSection = exports.deleteSection = exports.getSectionsByBoardId = exports.updateSection = exports.saveSection = exports.createSection = void 0;
const sectionFilters_1 = require("../../util/sectionFilters");
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
;
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
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.sectionId) }, update = { $set: {
                title: req.body.title,
                description: req.body.description,
                projectId: req.body.projectId
            } }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
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
;
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
async function getSections(boardId) {
    try {
        const query = { boardId: mongoose_1.default.Types.ObjectId(boardId) };
        const sections = await section_1.default.aggregate([
            { "$match": query },
            sectionFilters_1.sectionsLookup,
            sectionFilters_1.sectionAddFields
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhEQUdtQztBQUVuQyxtRUFBMkM7QUFDM0Msa0NBQXNEO0FBQ3RELHdEQUFnQztBQUNoQyx1Q0FBcUM7QUFFOUIsS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQ2pGLElBQUk7UUFDRixNQUFNLE9BQU8sR0FBRyxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQUU7UUFDdkMsY0FBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQzNEO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBVEQsc0NBU0M7QUFBQSxDQUFDO0FBRUssS0FBSyxVQUFVLFdBQVcsQ0FBQyxLQUFVO0lBQzFDLElBQUk7UUFDRixJQUFHLENBQUMsS0FBSyxFQUFDO1lBQ1IsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE9BQU8sTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDN0I7SUFBQyxPQUFNLEdBQUcsRUFBQztRQUNWLE1BQU0sR0FBRyxDQUFDO0tBQ1g7QUFDSCxDQUFDO0FBVkQsa0NBVUM7QUFFTSxLQUFLLFVBQVUsYUFBYSxDQUFDLEdB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