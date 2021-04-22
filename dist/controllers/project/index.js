"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsByUser = exports.findProjectsByUserAndDelete = exports.addBoardToProject = exports.deleteProject = exports.createProject = exports.getProjects = exports.updateProject = void 0;
const boardFilters_1 = require("../../util/boardFilters");
const util_1 = require("../../util");
const project_1 = __importDefault(require("../../models/project"));
const constants_1 = require("../../util/constants");
const user_1 = require("../user");
const board_1 = require("../board");
const mongoose_1 = __importDefault(require("mongoose"));
const projectFilters_1 = require("../../util/projectFilters");
async function updateProject(req, res, next) {
    var _a, _b;
    try {
        const user = util_1.getUser(req.headers.authorization);
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.projectId) }, update = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                userId: user === null || user === void 0 ? void 0 : user._id,
                status: req.body.status || "active",
                isPrivate: req.body.isPrivate || false,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true }; // new true will return modified document instead of original one
        const project = await getProject({
            $and: [
                { title: (_a = req.body.title) === null || _a === void 0 ? void 0 : _a.trim() },
                { description: (_b = req.body.description) === null || _b === void 0 ? void 0 : _b.trim() },
                { userId: user === null || user === void 0 ? void 0 : user._id },
            ],
        });
        if (project) {
            return res.status(409).json({
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Project with ${project === null || project === void 0 ? void 0 : project.title} already exist. Please choose different name`,
            });
        }
        const updated = await project_1.default.findOneAndUpdate(query, update, options);
        if (!updated) {
            return next(updated);
        }
        await user_1.addProjectToUser(updated === null || updated === void 0 ? void 0 : updated._id, user === null || user === void 0 ? void 0 : user._id);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateProject = updateProject;
async function getProjects(req, res) {
    var _a;
    try {
        const query = {
            userId: mongoose_1.default.Types.ObjectId(req.query.userId),
        };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        if ((_a = req.query.queryString) === null || _a === void 0 ? void 0 : _a.length) {
            aggregators.push({
                $match: {
                    $or: [{ title: { $regex: req.query.queryString, $options: "i" } }],
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
                    projectFilters_1.userLookup,
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    boardFilters_1.inProgressBoardsLookup,
                    boardFilters_1.completedBoardsLookup,
                    boardFilters_1.newBoardsLookup,
                    boardFilters_1.boardsLookup,
                    boardFilters_1.boardAddFields,
                ],
                total: [{ $match: query }, { $count: "count" }],
            },
        });
        const projects = await project_1.default.aggregate(aggregators);
        return res.status(200).send(projects ? projects[0] : projects);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getProjects = getProjects;
async function getProject(query) {
    try {
        const project = await project_1.default.findOne(query);
        return project;
    }
    catch (err) {
        throw err | err.message;
    }
}
async function createProject(payload) {
    try {
        if (!payload) {
            return;
        }
        const project = new project_1.default({
            title: payload.title,
            description: payload.description,
            userId: payload === null || payload === void 0 ? void 0 : payload.userId,
        });
        const created = await project.save();
        await user_1.addProjectToUser(created === null || created === void 0 ? void 0 : created._id, payload === null || payload === void 0 ? void 0 : payload.userId);
        return created;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.createProject = createProject;
async function deleteProject(req, res, next) {
    try {
        await board_1.findBoardsByProjectAndDelete(req.params.id);
        const deleted = await project_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res.status(200).json({ deleted: true });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteProject = deleteProject;
async function addBoardToProject(boardId, projectId) {
    try {
        if (!boardId || !projectId) {
            return;
        }
        const updated = await project_1.default.findByIdAndUpdate(projectId, { $push: { boards: boardId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding board to project ${err || err.message}`;
    }
}
exports.addBoardToProject = addBoardToProject;
async function findProjectsByUserAndDelete(userId) {
    try {
        const projectsList = await getProjectsByUser(userId);
        if (!(projectsList === null || projectsList === void 0 ? void 0 : projectsList.length)) {
            return;
        }
        const deleted = projectsList.reduce(async (promise, project) => {
            await promise;
            await board_1.findBoardsByProjectAndDelete(project === null || project === void 0 ? void 0 : project.id);
            // await findSectionsByBoardAndDelete(board._id)
            // await deleteNoteById(board._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findProjectsByUserAndDelete = findProjectsByUserAndDelete;
async function getProjectsByUser(userId) {
    try {
        if (!userId) {
            return;
        }
        return await project_1.default.find({ userId });
    }
    catch (err) {
        throw `Error while fetching projects ${err || err.message}`;
    }
}
exports.getProjectsByUser = getProjectsByUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9wcm9qZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDBEQU1pQztBQUNqQyxxQ0FBb0Q7QUFFcEQsbUVBQTJDO0FBQzNDLG9EQUErRDtBQUMvRCxrQ0FBMkM7QUFDM0Msb0NBQXdEO0FBQ3hELHdEQUFnQztBQUNoQyw4REFBdUQ7QUFFaEQsS0FBSyxVQUFVLGFBQWEsQ0FDakMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjs7SUFFbEIsSUFBSTtRQUNGLE1BQU0sSUFBSSxHQUFHLGNBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQXVCLENBQUMsQ0FBQztRQUMxRCxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUNoRSxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDckIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFDakMsTUFBTSxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxHQUFHO2dCQUNqQixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUTtnQkFDbkMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLEtBQUs7YUFDdkM7U0FDRixFQUNELE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlFQUFpRTtRQUVySSxNQUFNLE9BQU8sR0FBRyxNQUFNLFVBQVUsQ0FBQztZQUMvQixJQUFJLEVBQUU7Z0JB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