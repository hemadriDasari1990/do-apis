"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBoardsByProjectAndDelete = exports.deleteBoard = exports.getBoardDetails = exports.startOrCompleteBoard = exports.updateBoard = exports.addSectionToBoard = void 0;
const sectionFilters_1 = require("../../util/sectionFilters");
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
        throw "Cannot add section to Board";
    }
}
exports.addSectionToBoard = addSectionToBoard;
async function updateBoard(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.boardId) }, update = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                sprint: req.body.sprint,
                projectId: req.body.projectId,
                status: req.body.status || "pending",
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await board_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        await Array(parseInt(req.body.noOfSections))
            .fill(0)
            .reduce(async (promise) => {
            await promise;
            const section = await section_1.saveSection({
                boardId: updated._id,
                title: "Section Title",
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
async function startOrCompleteBoard(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.id) }, update = req.params.action === "start"
            ? {
                $set: {
                    startedAt: req.body.startedAt,
                    status: "inprogress",
                },
            }
            : {
                $set: {
                    completedAt: req.body.completedAt,
                    status: "completed",
                    isLocked: true,
                },
            };
        const updated = await board_1.default.findOneAndUpdate(query, update);
        if (!updated) {
            return next(updated);
        }
        const board = await getBoardDetailsLocal(updated === null || updated === void 0 ? void 0 : updated._id);
        return res.status(200).send(board);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.startOrCompleteBoard = startOrCompleteBoard;
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
            { $match: query },
            sectionFilters_1.sectionsLookup,
            sectionFilters_1.sectionAddFields,
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
        return res
            .status(200)
            .json({ message: "Resource has been deleted successfully" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ib2FyZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw4REFBNkU7QUFFN0UsK0RBQXVDO0FBQ3ZDLHdDQUErQztBQUMvQyx3REFBZ0M7QUFDaEMsd0NBQXlDO0FBRWxDLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsU0FBaUIsRUFDakIsT0FBZTtJQUVmLElBQUk7UUFDRixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sZUFBSyxDQUFDLGlCQUFpQixDQUN6QyxPQUFPLEVBQ1AsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFDbEMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUN2QyxDQUFDO1FBQ0YsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSw2QkFBNkIsQ0FBQztLQUNyQztBQUNILENBQUM7QUFqQkQsOENBaUJDO0FBRU0sS0FBSyxVQUFVLFdBQVcsQ0FDL0IsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFDOUQsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07Z0JBQ3ZCLFNBQVMsRUFB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