"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBoardReport = exports.inviteMemberToBoard = exports.changeVisibility = exports.addTeamsToBoad = exports.findBoardsByProjectAndDelete = exports.getBoard = exports.deleteBoard = exports.getBoards = exports.getBoardDetails = exports.getBoardDetailsLocal = exports.startOrCompleteBoard = exports.updateBoard = exports.addSectionToBoard = void 0;
const teamFilters_1 = require("../../util/teamFilters");
const project_1 = require("../project");
const member_1 = require("../member");
const util_1 = require("../../util");
const sectionFilters_1 = require("../../util/sectionFilters");
const board_1 = __importDefault(require("../../models/board"));
const constants_1 = require("../../util/constants");
const xlsx_1 = __importDefault(require("xlsx"));
const user_1 = require("../user");
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
async function updateBoard(req, res, next) {
    var _a, _b, _c;
    try {
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
        }
        /* Add existing project to board */
        if (req.body.projectId) {
            await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, req.body.projectId);
        }
        /* Create new project and map board to project */
        if (!req.body.projectId && req.body.projectTitle && user) {
            const newProject = await project_1.createProject({
                title: req.body.projectTitle,
                userId: user === null || user === void 0 ? void 0 : user._id,
            });
            await board_1.default.findByIdAndUpdate(updated._id, {
                projectId: newProject === null || newProject === void 0 ? void 0 : newProject._id,
            });
            await project_1.addBoardToProject(updated === null || updated === void 0 ? void 0 : updated._id, newProject === null || newProject === void 0 ? void 0 : newProject._id);
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
        const board = await getBoardDetailsLocal(req.params.id);
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const increment = { $inc: { views: 1 } };
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
    try {
        if (!payload || !(payload === null || payload === void 0 ? void 0 : payload.id)) {
            return;
        }
        const updated = await board_1.default.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.id, { $set: { isPrivate: payload === null || payload === void 0 ? void 0 : payload.isPrivate } }, { new: true, useFindAndModify: false });
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
        const board = await board_1.default.findById({
            _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.id),
        });
        const sent = await member_1.sendInviteToMember(board, payload === null || payload === void 0 ? void 0 : payload.user, payload === null || payload === void 0 ? void 0 : payload.member);
        return sent;
    }
    catch (err) {
        return `Error while sending invitation ${err || err.message}`;
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
            xlsx_1.default.writeFile(wb, `boardreport.xlsx`, {
                bookType: "xlsx",
                type: "binary",
            });
            const stream = fs_1.default.createReadStream(`boardreport.xlsx`);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=boardreport.xlsx");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9ib2FyZC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3REFLZ0M7QUFDaEMsd0NBQThEO0FBQzlELHNDQUE2RDtBQUM3RCxxQ0FBb0Q7QUFDcEQsOERBQTZFO0FBRTdFLCtEQUF1QztBQUN2QyxvREFBK0Q7QUFDL0QsZ0RBQXdCO0FBQ3hCLGtDQUEwQztBQUMxQyxvREFBdUQ7QUFDdkQsd0NBQTBEO0FBQzFELDRDQUFvQjtBQUNwQix3REFBZ0M7QUFDaEMsOERBQTBEO0FBQzFELHdDQUF5QztBQUVsQyxLQUFLLFVBQVUsaUJBQWlCLENBQ3JDLFNBQWlCLEVBQ2pCLE9BQWU7SUFFZixJQUFJO1FBQ0YsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQUssQ0FBQyxpQkFBaUIsQ0FDekMsT0FBTyxFQUNQLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQ2xDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsQ0FDdkMsQ0FBQztRQUNGLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sNkJBQTZCLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBakJELDhDQWlCQztBQUVNLEtBQUssVUFBVSxXQUFXLENBQy9CLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7O0lBRWxCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxjQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUF1QixDQUFDLENBQUM7UUFDMUQsTUFBTSxZQUFZLEdBQUcsTUFBTSxRQUFRLENBQUM7WUFDbEMsSUFBSSxFQUFFO2dCQUNKLEVBQUUsS0FBSyxRQUFFLEdB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