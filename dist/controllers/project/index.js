"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProjectsByDepartmentAndDelete = exports.addBoardToProject = exports.deleteProject = exports.getProjectDetails = exports.updateProject = void 0;
const projectFilters_1 = require("../../util/projectFilters");
const project_1 = __importDefault(require("../../models/project"));
const department_1 = require("../department");
const board_1 = require("../board");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateProject(req, res, next) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.projectId) }, update = { $set: {
                title: req.body.title,
                description: req.body.description,
                departmentId: req.body.departmentId
            } }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
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
;
async function getProjectDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const projects = await project_1.default.aggregate([
            { "$match": query },
            projectFilters_1.projectsLookup,
            projectFilters_1.projectAddFields
        ]);
        return res.status(200).json(projects ? projects[0] : null);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getProjectDetails = getProjectDetails;
// async function getProjects(boardId: string): Promise<any> {
//   try {
//     const query = { organizationId: mongoose.Types.ObjectId(boardId) };
//     const projects = await Project.aggregate([
//       { "$match": query },
//       projectsLookup,
//       projectAddFields
//     ]);
//     return projects;
//   } catch(err){
//     throw err | err.message;
//   }
// }
async function deleteProject(req, res, next) {
    try {
        await board_1.findBoardsByProjectAndDelete(req.params.id);
        const deleted = await project_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res.status(200).send(deleted);
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
            // await findSectionsByBoardAndDelete(board._id)
            // await deleteNoteById(board._id);
            console.log(project);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9wcm9qZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhEQUdtQztBQUVuQyxtRUFBMkM7QUFDM0MsOENBQXVEO0FBQ3ZELG9DQUF3RDtBQUN4RCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO0lBQ2pGLElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUNqRSxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVk7YUFDcEMsRUFBQyxFQUNGLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUNqRSxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RSxJQUFHLENBQUMsT0FBTyxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7UUFDRCxNQUFNLG1DQUFzQixDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNsRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFD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