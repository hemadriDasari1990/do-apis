"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTeamsToBoad = exports.findBoardsByProjectAndDelete = exports.getBoard = exports.deleteBoard = exports.getBoards = exports.getBoardDetailsLocal = exports.getBoardDetails = exports.startOrCompleteBoard = exports.updateBoard = exports.addSectionToBoard = void 0;
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
const user_1 = require("../user");
const util_1 = require("../../util");
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
        const boardsCount = await board_1.default.find(Object.assign({}, (req.body.accountType === "commercial"
            ? { projectId: req.body.projectId }
            : { userId: req.body.userId }))).count();
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.boardId) }, update = {
            $set: Object.assign(Object.assign(Object.assign(Object.assign({}, (req.body.isSystemName
                ? {
                    title: "Retro " + (boardsCount + 1),
                }
                : {
                    title: req.body.title + (boardsCount + 1),
                })), { description: req.body.description }), (req.body.accountType === "commercial"
                ? { projectId: req.body.projectId }
                : { userId: req.body.userId })), { status: req.body.status || "draft", sprint: boardsCount + 1, isDefaultBoard: req.body.isDefaultBoard, isSystemName: req.body.isSystemName }),
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
        if (req.body.accountType === "commercial" && req.body.projectId) {
            await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, req.body.projectId);
        }
        if (req.body.accountType === "individual" && req.body.userId) {
            await user_1.addBoardToUser(updated === null || updated === void 0 ? void 0 : updated._id, req.body.userId);
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
        const increment = { $inc: { views: 1 } };
        await board_1.default.findOneAndUpdate(query, increment);
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
async function getBoards(req, res) {
    var _a;
    try {
        const query = req.body.accountType === "commercial"
            ? {
                projectId: mongoose_1.default.Types.ObjectId(req.query.id),
            }
            : {
                userId: mongoose_1.default.Types.ObjectId(req.query.id),
            };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        if ((_a = req.query.queryString) === null || _a === void 0 ? void 0 : _a.length) {
            aggregators.push({
                $match: { $text: { $search: req.query.queryString, $language: "en" } },
            });
            aggregators.push({ $addFields: { score: { $meta: "textScore" } } });
        }
        aggregators.push({
            $facet: {
                data: [
                    { $match: query },
                    { $sort: { _id: -1 } },
                    { $skip: offset },
                    { $limit: limit },
                    teamFilters_1.teamsLookup,
                    teamFilters_1.inActiveTeamsLookup,
                    teamFilters_1.activeTeamsLookup,
                    teamFilters_1.teamAddFields,
                    sectionFilters_1.sectionsLookup,
                    sectionFilters_1.sectionAddFields,
                ],
                total: [{ $count: "count" }],
            },
        });
        const boards = await board_1.default.aggregate(aggregators);
        return res.status(200).send(boards ? boards[0] : null);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getBoards = getBoards;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ib2FyZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw4REFBNkU7QUFFN0UsK0RBQXVDO0FBQ3ZDLG9EQUErRDtBQUMvRCx3Q0FBK0M7QUFDL0Msd0NBQTBEO0FBQzFELHdEQUFnQztBQUNoQyx3Q0FBeUM7QUFDekMsd0RBS2dDO0FBQ2hDLG9EQUF1RDtBQUN2RCw4REFBMkQ7QUFDM0Qsa0NBQXlDO0FBQ3pDLHFDQUEyQztBQUVwQyxLQUFLLFVBQVUsaUJBQWlCLENBQ3JDLFNBQWlCLEVBQ2pCLE9BQWU7SUFFZixJQUFJO1FBQ0YsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQUssQ0FBQyxpQkFBaUIsQ0FDekMsT0FBTyxFQUNQLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQ2xDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsQ0FDdkMsQ0FBQztRQUNGLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sNkJBQTZCLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBakJELDhDQWlCQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQy9CLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7O0lBRWxCLElBQUk7UUFDRixNQUFNLFlBQVksR0FBRyxNQUFNLFFBQVEsQ0FBQztZQUNsQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDckUsQ0FBQyxDQUFDO1FBQ0gsSUFB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