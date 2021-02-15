"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBoardsByProjectAndDelete = exports.deleteBoard = exports.getBoardDetails = exports.updateBoard = exports.addSectionToBoard = void 0;
const boardFilters_1 = require("../../util/boardFilters");
const board_1 = __importDefault(require("../../models/board"));
const project_1 = require("../project");
const mongoose_1 = __importDefault(require("mongoose"));
const section_1 = require("../section");
async function addSectionToBoard(sectionId, boardId) {
    try {
        if (!boardId || !sectionId) {
            return;
        }
        const board = await board_1.default.findByIdAndUpdate(boardId, { $push: { sections: sectionId } }, { new: true, useFindAndModify: false });
        return board;
    }
    catch (err) {
        throw 'Cannot add section to Board';
    }
}
exports.addSectionToBoard = addSectionToBoard;
async function updateBoard(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.boardId) }, update = { $set: {
                title: req.body.title,
                description: req.body.description,
                sprint: req.body.sprint,
                duration: req.body.duration,
                projectId: req.body.projectId
            } }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await board_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        await Array(parseInt(req.body.noOfSections)).fill(0).reduce(async (promise) => {
            await promise;
            const section = await section_1.saveSection({
                boardId: updated._id,
                title: "Section Title"
            });
            await addSectionToBoard(section === null || section === void 0 ? void 0 : section._id, updated._id);
        }, Promise.resolve());
        await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, req.body.projectId);
        const board = await getBoardDetailsLocal(updated === null || updated === void 0 ? void 0 : updated._id);
        return res.status(200).send(board);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateBoard = updateBoard;
;
async function getBoardDetails(req, res) {
    try {
        const board = await getBoardDetailsLocal(req.params.id);
        return res.status(200).send(board);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getBoardDetails = getBoardDetails;
async function getBoardDetailsLocal(boardId) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(boardId) };
        const boards = await board_1.default.aggregate([
            { "$match": query },
            boardFilters_1.sectionsLookup,
            boardFilters_1.boardAddFields
        ]);
        return boards ? boards[0] : null;
    }
    catch (err) {
        throw err || err.message;
    }
}
async function deleteBoard(req, res, next) {
    try {
        const deleted = await board_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res.status(200).json({ message: "Resource has been deleted successfully" });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteBoard = deleteBoard;
async function findBoardsByProjectAndDelete(projectId) {
    try {
        const boardsList = await getBoardsByProject(projectId);
        if (!(boardsList === null || boardsList === void 0 ? void 0 : boardsList.length)) {
            return;
        }
        const deleted = boardsList.reduce(async (promise, board) => {
            await promise;
            // await findSectionsByBoardAndDelete(board._id)
            // await deleteNoteById(board._id);
            console.log(board);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findBoardsByProjectAndDelete = findBoardsByProjectAndDelete;
// async function deleteNoteById(noteId: string):Promise<any> {
//   try {
//     if(!noteId){
//       return;
//     }
//     return await Note.findByIdAndRemove(noteId);
//   } catch(err) {
//     throw `Error while deleting note ${err || err.message}`;
//   }
// }
async function getBoardsByProject(projectId) {
    try {
        if (!projectId) {
            return;
        }
        return await board_1.default.find({ projectId });
    }
    catch (err) {
        throw `Error while fetching boards ${err || err.message}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ib2FyZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwwREFHaUM7QUFFakMsK0RBQXVDO0FBQ3ZDLHdDQUErQztBQUMvQyx3REFBZ0M7QUFDaEMsd0NBQXlDO0FBRWxDLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxTQUFpQixFQUFFLE9BQWU7SUFDeEUsSUFBSTtRQUNGLElBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUM7WUFDeEIsT0FBTztTQUNSO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFLLENBQUMsaUJBQWlCLENBQ3pDLE9BQU8sRUFDUCxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBQyxFQUNqQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLENBQ3ZDLENBQUM7UUFDRixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUMsT0FBTSxHQUFHLEVBQUM7UUFDVixNQUFNLDZCQUE2QixDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQWRELDhDQWNDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQy9FLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUMvRCxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ3ZCLFFBQVEsRUFBRSxH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