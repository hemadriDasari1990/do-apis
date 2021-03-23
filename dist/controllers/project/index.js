"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProjectsByDepartmentAndDelete = exports.addBoardToProject = exports.deleteProject = exports.getProjectDetails = exports.updateProject = void 0;
const boardFilters_1 = require("../../util/boardFilters");
const project_1 = __importDefault(require("../../models/project"));
const constants_1 = require("../../util/constants");
const department_1 = require("../department");
const board_1 = require("../board");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateProject(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.projectId) }, update = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                departmentId: req.body.departmentId,
                status: req.body.status || "active",
                isPrivate: req.body.isPrivate || false,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true }; // new true will return modified document instead of original one
        const project = await getProject({
            $and: [
                { title: req.body.title },
                { departmentId: req.body.departmentId },
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
        await department_1.addProjectToDepartment(updated === null || updated === void 0 ? void 0 : updated._id, req.body.departmentId);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateProject = updateProject;
async function getProjectDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const projects = await project_1.default.aggregate([
            { $match: query },
            {
                $sort: { _id: -1 },
            },
            {
                $skip: parseInt(req.query.offset),
            },
            {
                $limit: parseInt(req.query.limit),
            },
            boardFilters_1.boardsLookup,
            boardFilters_1.boardAddFields,
        ]);
        return res.status(200).json(projects ? projects[0] : null);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getProjectDetails = getProjectDetails;
async function getProject(query) {
    try {
        const project = await project_1.default.findOne(query);
        return project;
    }
    catch (err) {
        throw err | err.message;
    }
}
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
        throw `Error while adding note to section ${err || err.message}`;
    }
}
exports.addBoardToProject = addBoardToProject;
async function findProjectsByDepartmentAndDelete(departmentId) {
    try {
        const projectsList = await getProjectsByDepartment(departmentId);
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
exports.findProjectsByDepartmentAndDelete = findProjectsByDepartmentAndDelete;
async function getProjectsByDepartment(departmentId) {
    try {
        if (!departmentId) {
            return;
        }
        return await project_1.default.find({ departmentId });
    }
    catch (err) {
        throw `Error while fetching projects ${err || err.message}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9wcm9qZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDBEQUF1RTtBQUV2RSxtRUFBMkM7QUFDM0Msb0RBQStEO0FBQy9ELDhDQUF1RDtBQUN2RCxvQ0FBd0Q7QUFDeEQsd0RBQWdDO0FBRXpCLEtBQUssVUFBVSxhQUFhLENBQ2pDLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQ2hFLE1BQU0sR0FBRztZQUNQLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUNyQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUNqQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZO2dCQUNuQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUTtnQkFDbkMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLEtBQUs7YUFDdkM7U0FDRixFQUNELE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGlFQUFpRTtRQUNySSxNQUFNLE9BQU8sR0FBRyxNQUFNLFVBQVUsQ0FBQztZQUMvQixJQUFJLEVBQUU7Z0JBQ0osRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3pCLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2FBQ3hD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