"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTeamsToBoad = exports.findBoardsByProjectAndDelete = exports.getBoard = exports.deleteBoard = exports.getBoardDetailsLocal = exports.getBoardDetails = exports.startOrCompleteBoard = exports.updateBoard = exports.addSectionToBoard = void 0;
const sectionFilters_1 = require("../../util/sectionFilters");
const board_1 = __importDefault(require("../../models/board"));
const constants_1 = require("../../util/constants");
const project_1 = require("../project");
const section_1 = require("../section");
const mongoose_1 = __importDefault(require("mongoose"));
const section_2 = require("../section");
const teamFilters_1 = require("../../util/teamFilters");
const constants_2 = require("../../util/constants");
const projectFilters_1 = require("../../util/projectFilters");
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
    var _a;
    try {
        const boardDetails = await getBoard({
            $and: [{ title: req.body.title }, { projectId: req.body.projectId }],
        });
        if (boardDetails) {
            return res.status(409).json({
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Board with ${boardDetails === null || boardDetails === void 0 ? void 0 : boardDetails.title} already exist. Please choose different name`,
            });
        }
        const boardsCount = await board_1.default.find({
            projectId: req.body.projectId,
        }).count();
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.boardId) }, update = {
            $set: Object.assign(Object.assign({}, (req.body.isSystemName
                ? {
                    title: "Retro " + (boardsCount + 1),
                }
                : {
                    title: req.body.title + (boardsCount + 1),
                })), { description: req.body.description, projectId: req.body.projectId, status: req.body.status || "draft", sprint: boardsCount + 1, isDefaultBoard: req.body.isDefaultBoard, isSystemName: req.body.isSystemName }),
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await board_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        if ((updated === null || updated === void 0 ? void 0 : updated.status) !== "draft" &&
            !req.body.isDefaultBoard &&
            req.body.noOfSections) {
            await Array(parseInt(req.body.noOfSections))
                .fill(0)
                .reduce(async (promise) => {
                await promise;
                const section = await section_2.saveSection({
                    boardId: updated._id,
                    title: "Section Title",
                });
                await addSectionToBoard(section === null || section === void 0 ? void 0 : section._id, updated._id);
            }, Promise.resolve());
        }
        if ((updated === null || updated === void 0 ? void 0 : updated.status) !== "draft" &&
            req.body.isDefaultBoard &&
            !req.body.noOfSections) {
            (await (constants_2.defaultSections === null || constants_2.defaultSections === void 0 ? void 0 : constants_2.defaultSections.length)) &&
                constants_2.defaultSections.reduce(async (promise, defaultSectionTitle) => {
                    await promise;
                    const section = await section_2.saveSection({
                        boardId: updated._id,
                        title: defaultSectionTitle,
                    });
                    await addSectionToBoard(section === null || section === void 0 ? void 0 : section._id, updated._id);
                }, Promise.resolve());
        }
        if ((_a = req.body.teams) === null || _a === void 0 ? void 0 : _a.length) {
            await addTeamsToBoad(req.body.teams, updated === null || updated === void 0 ? void 0 : updated._id);
        }
        if (req.body.projectId) {
            await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, req.body.projectId);
        }
        const board = await getBoardDetailsLocal(updated === null || updated === void 0 ? void 0 : updated._id);
        return res.status(200).send(board);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateBoard = updateBoard;
async function startOrCompleteBoard(payload) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.id) }, update = payload.action === "start"
            ? {
                $set: {
                    startedAt: payload.startedAt,
                    status: "inprogress",
                },
            }
            : {
                $set: {
                    completedAt: payload.completedAt,
                    status: "completed",
                    isLocked: true,
                },
            };
        const options = { new: true }; // return updated document
        const updated = await board_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return updated;
        }
        const board = await getBoardDetailsLocal(updated === null || updated === void 0 ? void 0 : updated._id);
        return board;
    }
    catch (err) {
        return err || err.message;
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
            projectFilters_1.projectsLookup,
            teamFilters_1.teamsLookup,
            teamFilters_1.inActiveTeamsLookup,
            teamFilters_1.activeTeamsLookup,
            teamFilters_1.teamAddFields,
            sectionFilters_1.sectionsLookup,
            sectionFilters_1.sectionAddFields,
        ]);
        return boards ? boards[0] : null;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.getBoardDetailsLocal = getBoardDetailsLocal;
async function deleteBoard(req, res, next) {
    try {
        const deleted = await board_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res.status(200).json({
            deleted: true,
            message: "Resource has been deleted successfully",
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteBoard = deleteBoard;
async function getBoard(query) {
    try {
        const board = await board_1.default.findOne(query).populate([
            {
                path: "projectId",
                model: "Project",
            },
        ]);
        return board;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.getBoard = getBoard;
async function findBoardsByProjectAndDelete(projectId) {
    try {
        const boardsList = await getBoardsByProject(projectId);
        if (!(boardsList === null || boardsList === void 0 ? void 0 : boardsList.length)) {
            return;
        }
        const deleted = boardsList.reduce(async (promise, board) => {
            await promise;
            await section_1.findSectionsByBoardAndDelete(board._id);
            // await deleteNoteById(board._id);
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
async function addTeamsToBoad(teams, boardId) {
    try {
        if (!teams || !Array.isArray(teams) || !(teams === null || teams === void 0 ? void 0 : teams.length) || !boardId) {
            return;
        }
        await teams.reduce(async (promise, team) => {
            await promise;
            await board_1.default.findByIdAndUpdate(boardId, { $push: { teams: team } }, { new: true, useFindAndModify: false });
        }, Promise.resolve());
    }
    catch (err) {
        throw `Error while adding team to board ${err || err.message}`;
    }
}
exports.addTeamsToBoad = addTeamsToBoad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ib2FyZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw4REFBNkU7QUFFN0UsK0RBQXVDO0FBQ3ZDLG9EQUErRDtBQUMvRCx3Q0FBK0M7QUFDL0Msd0NBQTBEO0FBQzFELHdEQUFnQztBQUNoQyx3Q0FBeUM7QUFDekMsd0RBS2dDO0FBQ2hDLG9EQUF1RDtBQUN2RCw4REFBMkQ7QUFFcEQsS0FBSyxVQUFVLGlCQUFpQixDQUNyQyxTQUFpQixFQUNqQixPQUFlO0lBRWYsSUFBSTtRQUNGLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDMUIsT0FBTztTQUNSO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxlQUFLLENBQUMsaUJBQWlCLENBQ3pDLE9BQU8sRUFDUCxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUNsQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLENBQ3ZDLENBQUM7UUFDRixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLDZCQUE2QixDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQWpCRCw4Q0FpQkM7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUMvQixHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCOztJQUVsQixJQUFJO1FBQ0YsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUM7WUFDbEMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3JFLENBQUMsQ0FBQztRQUNILElBQUksWUFBWSxFQUFFO1lBQ2hCLE9BQU8sR0FB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