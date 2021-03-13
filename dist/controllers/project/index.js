"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProjectsByDepartmentAndDelete = exports.addBoardToProject = exports.deleteProject = exports.getProjectDetails = exports.updateProject = void 0;
const boardFilters_1 = require("../../util/boardFilters");
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
                isPrivate: req.body.isPrivate || false,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9wcm9qZWN0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDBEQUF1RTtBQUV2RSxtRUFBMkM7QUFDM0MsOENBQXVEO0FBQ3ZELG9DQUF3RDtBQUN4RCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLGFBQWEsQ0FDakMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFDaEUsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQ3JCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2pDLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVk7Z0JBQ25DLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRO2dCQUNuQyxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksS0FBSzthQUN2QztTQUNGLEVBQ0QsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25FLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE1BQU0sbUNBQXNCLENBQUMsT0FBTyxhQUFQLE9B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