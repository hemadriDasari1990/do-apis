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
        const query = { _id: mongoose_1.default.Types.ObjectId(req.body.projectId) }, update = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                departmentId: req.body.departmentId,
                status: req.body.status || "active",
                private: req.body.private || false,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
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
            projectFilters_1.projectsLookup,
            projectFilters_1.projectAddFields,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9wcm9qZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhEQUE2RTtBQUU3RSxtRUFBMkM7QUFDM0MsOENBQXVEO0FBQ3ZELG9DQUF3RDtBQUN4RCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLGFBQWEsQ0FDakMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFDaEUsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVk7Z0JBQ25DLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRO2dCQUNuQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSzthQUNuQztTQUNGLEVBQ0QsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25FLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE1BQU0sbUNBQXNCLENBQUMsT0FBTyxhQUFQLE9B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