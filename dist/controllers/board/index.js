"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBoardReport = exports.inviteMemberToBoard = exports.changeVisibility = exports.addTeamsToBoad = exports.findBoardsByProjectAndDelete = exports.getBoard = exports.deleteBoard = exports.getBoards = exports.getBoardDetails = exports.getBoardDetailsLocal = exports.startOrCompleteBoard = exports.updateBoard = exports.checkIfNewBoardExists = exports.addSectionToBoard = void 0;
const constants_1 = require("../../util/constants");
const teamFilters_1 = require("../../util/teamFilters");
const project_1 = require("../project");
const member_1 = require("../member");
const util_1 = require("../../util");
const sectionFilters_1 = require("../../util/sectionFilters");
const board_1 = __importDefault(require("../../models/board"));
const xlsx_1 = __importDefault(require("xlsx"));
const user_1 = require("../user");
const activity_1 = require("../activity");
const invite_1 = require("../invite");
const constants_2 = require("../../util/constants");
const section_1 = require("../section");
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const projectFilters_1 = require("../../util/projectFilters");
const section_2 = require("../section");
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
async function checkIfNewBoardExists(projectId) {
    try {
        if (!projectId) {
            return;
        }
        const board = await getBoard({
            $and: [{ status: "new" }, { projectId: projectId }],
        });
        return board;
    }
    catch (err) {
        throw "Cannot get board details";
    }
}
exports.checkIfNewBoardExists = checkIfNewBoardExists;
async function updateBoard(req, res, next) {
    var _a, _b, _c;
    try {
        if (!req.body.isDefaultBoard && req.body.noOfSections > 10) {
            return res.status(500).json({
                errorId: constants_1.SECTION_COUNT_EXCEEDS,
                message: `Max no of sections allowed are only 10`,
            });
        }
        const user = util_1.getUser(req.headers.authorization);
        const boardDetails = await getBoard({
            $and: [
                { title: (_a = req.body.title) === null || _a === void 0 ? void 0 : _a.trim() },
                { description: (_b = req.body.description) === null || _b === void 0 ? void 0 : _b.trim() },
                { projectId: req.body.projectId },
            ],
        });
        if (boardDetails) {
            return res.status(409).json({
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Board with ${boardDetails === null || boardDetails === void 0 ? void 0 : boardDetails.title} already exist. Please choose different name`,
            });
        }
        /* Check if board exists with status new */
        if (!req.body.boardId) {
            const boardExists = await checkIfNewBoardExists(req.body.projectId);
            if (boardExists === null || boardExists === void 0 ? void 0 : boardExists._id) {
                return res.status(409).json({
                    errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                    message: `Sorry you can't create another one as there is already one i.e., ${boardExists === null || boardExists === void 0 ? void 0 : boardExists.title} in new state.`,
                });
            }
        }
        const boardsCount = await board_1.default.find({
            projectId: req.body.projectId,
        }).count();
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.boardId) }, update = {
            $set: Object.assign(Object.assign({}, (!req.body.boardId ? { title: "Retro " + (boardsCount + 1) } : {})), { description: req.body.description, projectId: req.body.projectId, status: req.body.status, sprint: boardsCount + 1, isDefaultBoard: req.body.isDefaultBoard }),
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await board_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        if (!req.body.isDefaultBoard && req.body.noOfSections) {
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
        if (req.body.isDefaultBoard && !req.body.noOfSections) {
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
        if ((_c = req.body.teams) === null || _c === void 0 ? void 0 : _c.length) {
            await addTeamsToBoad(req.body.teams, updated === null || updated === void 0 ? void 0 : updated._id);
            await invite_1.createInvitedTeams(req.body.teams, updated === null || updated === void 0 ? void 0 : updated._id);
        }
        /* Add existing project to board */
        if (req.body.projectId) {
            await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, req.body.projectId);
        }
        /* Create new project and map board to project */
        if (!req.body.projectId && req.body.projectTitle && user) {
            const newProject = await project_1.createProject({
                title: req.body.projectTitle,
                description: req.body.projectDescription,
                userId: user === null || user === void 0 ? void 0 : user._id,
            });
            await board_1.default.findByIdAndUpdate(updated._id, {
                projectId: newProject === null || newProject === void 0 ? void 0 : newProject._id,
            });
            await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, newProject === null || newProject === void 0 ? void 0 : newProject._id);
        }
        await activity_1.createActivity({
            userId: user === null || user === void 0 ? void 0 : user._id,
            boardId: updated === null || updated === void 0 ? void 0 : updated._id,
            title: `${updated === null || updated === void 0 ? void 0 : updated.title}`,
            primaryAction: "board",
            type: "board",
            action: req.body.boardId ? "update" : "create",
        });
        const board = await getBoardDetailsLocal(updated === null || updated === void 0 ? void 0 : updated._id);
        return res.status(200).send(board);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateBoard = updateBoard;
async function startOrCompleteBoard(payload) {
    var _a;
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
        await activity_1.createActivity({
            userId: (_a = payload === null || payload === void 0 ? void 0 : payload.user) === null || _a === void 0 ? void 0 : _a._id,
            boardId: payload.id,
            title: "the session",
            type: "board",
            action: payload.action === "start" ? "session-start" : "session-stop",
        });
        const board = await getBoardDetailsLocal(updated === null || updated === void 0 ? void 0 : updated._id);
        return board;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.startOrCompleteBoard = startOrCompleteBoard;
async function getBoardDetailsLocal(boardId) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(boardId) };
        const boards = await board_1.default.aggregate([
            { $match: query },
            projectFilters_1.projectLookup,
            {
                $unwind: {
                    path: "$project",
                    preserveNullAndEmptyArrays: true,
                },
            },
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
async function getBoardDetails(req, res) {
    try {
        const user = util_1.getUser(req.headers.authorization);
        const board = await getBoardDetailsLocal(req.params.id);
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const increment = { $inc: { views: 1 } };
        await activity_1.createActivity({
            userId: user === null || user === void 0 ? void 0 : user._id,
            boardId: board === null || board === void 0 ? void 0 : board._id,
            title: `${board === null || board === void 0 ? void 0 : board.title}`,
            type: "board",
            action: "view",
        });
        await board_1.default.findOneAndUpdate(query, increment);
        return res.status(200).send(board);
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.getBoardDetails = getBoardDetails;
async function getBoards(req, res) {
    var _a;
    try {
        const query = {
            projectId: mongoose_1.default.Types.ObjectId(req.query.projectId),
        };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        if ((_a = req.query.queryString) === null || _a === void 0 ? void 0 : _a.length) {
            aggregators.push({
                $match: {
                    $or: [
                        { title: { $regex: req.query.queryString, $options: "i" } },
                        { sprint: { $regex: req.query.queryString, $options: "i" } },
                    ],
                },
            });
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
                total: [{ $match: query }, { $count: "count" }],
            },
        });
        const boards = await board_1.default.aggregate(aggregators);
        return res.status(200).send(boards ? boards[0] : boards);
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
async function changeVisibility(payload) {
    var _a;
    try {
        if (!payload || !(payload === null || payload === void 0 ? void 0 : payload.id)) {
            return;
        }
        const updated = await board_1.default.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.id, { $set: { isPrivate: payload === null || payload === void 0 ? void 0 : payload.isPrivate } }, { new: true, useFindAndModify: false });
        await activity_1.createActivity({
            userId: (_a = payload === null || payload === void 0 ? void 0 : payload.user) === null || _a === void 0 ? void 0 : _a._id,
            boardId: updated === null || updated === void 0 ? void 0 : updated._id,
            title: `${updated === null || updated === void 0 ? void 0 : updated.title}`,
            primaryAction: "visibility to",
            primaryTitle: (payload === null || payload === void 0 ? void 0 : payload.isPrivate) ? "private" : "public",
            type: "visibility",
            action: (payload === null || payload === void 0 ? void 0 : payload.isPrivate) ? "private" : "public",
        });
        return updated;
    }
    catch (err) {
        return `Error while updating board visibility ${err || err.message}`;
    }
}
exports.changeVisibility = changeVisibility;
async function inviteMemberToBoard(payload) {
    var _a, _b, _c, _d;
    try {
        if (!payload || !(payload === null || payload === void 0 ? void 0 : payload.id) || !payload.user || !payload.member) {
            return;
        }
        if (payload === null || payload === void 0 ? void 0 : payload.createMember) {
            const created = await member_1.createMember({
                email: (_a = payload === null || payload === void 0 ? void 0 : payload.member) === null || _a === void 0 ? void 0 : _a.email,
                name: (_b = payload === null || payload === void 0 ? void 0 : payload.member) === null || _b === void 0 ? void 0 : _b.name,
                userId: (_c = payload === null || payload === void 0 ? void 0 : payload.user) === null || _c === void 0 ? void 0 : _c._id,
            });
            await user_1.addMemberToUser(created === null || created === void 0 ? void 0 : created._id, (_d = payload === null || payload === void 0 ? void 0 : payload.user) === null || _d === void 0 ? void 0 : _d._id);
        }
        const board = await board_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.id);
        const sent = await member_1.sendInviteToMember(board, payload === null || payload === void 0 ? void 0 : payload.user, payload === null || payload === void 0 ? void 0 : payload.member);
        return sent;
    }
    catch (err) {
        return `Error while sending inviting ${err || err.message}`;
    }
}
exports.inviteMemberToBoard = inviteMemberToBoard;
async function downloadBoardReport(req, res) {
    var _a;
    try {
        const data = await getBoardDetailsLocal(req.params.id);
        if (data && ((_a = data === null || data === void 0 ? void 0 : data.sections) === null || _a === void 0 ? void 0 : _a.length)) {
            const wb = xlsx_1.default.utils.book_new();
            const ws = xlsx_1.default.utils.json_to_sheet(data === null || data === void 0 ? void 0 : data.sections);
            xlsx_1.default.utils.book_append_sheet(wb, ws, "report");
            xlsx_1.default.writeFile(wb, `${data === null || data === void 0 ? void 0 : data.title}.xlsx`, {
                bookType: "xlsx",
                type: "binary",
            });
            const stream = fs_1.default.createReadStream(`${data === null || data === void 0 ? void 0 : data.title}.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=${data === null || data === void 0 ? void 0 : data.title}.xlsx`);
            stream.pipe(res);
        }
        else {
            throw new Error("No data found on this board");
        }
    }
    catch (err) {
        throw new Error("Error while generating the report");
    }
}
exports.downloadBoardReport = downloadBoardReport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ib2FyZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvREFHOEI7QUFDOUIsd0RBS2dDO0FBQ2hDLHdDQUE4RDtBQUM5RCxzQ0FBNkQ7QUFDN0QscUNBQW9EO0FBQ3BELDhEQUE2RTtBQUU3RSwrREFBdUM7QUFDdkMsZ0RBQXdCO0FBQ3hCLGtDQUEwQztBQUMxQywwQ0FBNkM7QUFDN0Msc0NBQStDO0FBQy9DLG9EQUF1RDtBQUN2RCx3Q0FBMEQ7QUFDMUQsNENBQW9CO0FBQ3BCLHdEQUFnQztBQUNoQyw4REFBMEQ7QUFDMUQsd0NBQXlDO0FBRWxDLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsU0FBaUIsRUFDakIsT0FBZTtJQUVmLElBQUk7UUFDRixJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sZUFBSyxDQUFDLGlCQUFpQixDQUN6QyxPQUFPLEVBQ1AsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFDbEMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUN2QyxDQUFDO1FBQ0YsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSw2QkFBNkIsQ0FBQztLQUNyQztBQUNILENBQUM7QUFqQkQsOENBaUJDO0FBRU0sS0FBSyxVQUFVLHFCQUFxQixDQUFDLFNBQWlCO0lBQzNELElBQUk7UUFDRixJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxRQUFRLENBQUM7WUFDM0IsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxTQUFT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