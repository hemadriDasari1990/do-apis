"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProjectToDepartment = exports.deleteDepartment = exports.getDepartments = exports.getDepartmentDetails = exports.updateDepartment = void 0;
const projectFilters_1 = require("../../util/projectFilters");
const department_1 = __importDefault(require("../../models/department"));
const constants_1 = require("../../util/constants");
const user_1 = require("../user");
const project_1 = require("../project");
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../../index");
async function updateDepartment(req, res, next) {
    try {
        const update = {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,
            status: req.body.status || "active",
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const department = await getDepartment({
            $and: [{ title: req.body.title }, { userId: req.body.userId }],
        });
        if (department) {
            return res.status(409).json({
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Department with ${department === null || department === void 0 ? void 0 : department.title} already exist. Please choose different name`,
            });
        }
        const updated = await department_1.default.findByIdAndUpdate(req.body.departmentId
            ? req.body.departmentId
            : new mongoose_1.default.Types.ObjectId(), update, options);
        if (!updated) {
            return next(updated);
        }
        await user_1.addDepartmentToUser(updated === null || updated === void 0 ? void 0 : updated._id, req.body.userId);
        return res.status(200).send(updated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateDepartment = updateDepartment;
async function getDepartmentDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const departments = await department_1.default.aggregate([
            { $match: query },
            projectFilters_1.projectsLookup,
            projectFilters_1.projectAddFields,
        ]);
        return res.status(200).json(departments ? departments[0] : null);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getDepartmentDetails = getDepartmentDetails;
async function getDepartments(userId) {
    try {
        const query = { userId: mongoose_1.default.Types.ObjectId(userId) };
        const departments = await department_1.default.aggregate([
            { $match: query },
            projectFilters_1.projectsLookup,
            projectFilters_1.projectAddFields,
        ]);
        index_1.socket.emit("get-departments", departments);
    }
    catch (err) {
        index_1.socket.emit("get-departments", err);
    }
}
exports.getDepartments = getDepartments;
async function getDepartment(query) {
    try {
        const department = await department_1.default.findOne(query);
        return department;
    }
    catch (err) {
        throw err | err.message;
    }
}
async function deleteDepartment(req, res, next) {
    try {
        await project_1.findProjectsByDepartmentAndDelete(req.params.id);
        const deleted = await department_1.default.findByIdAndRemove(req.params.id);
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
exports.deleteDepartment = deleteDepartment;
async function addProjectToDepartment(projectId, departmentId) {
    try {
        if (!projectId || !departmentId) {
            return;
        }
        const updated = await department_1.default.findByIdAndUpdate(departmentId, { $push: { projects: projectId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding project to department ${err || err.message}`;
    }
}
exports.addProjectToDepartment = addProjectToDepartment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9kZXBhcnRtZW50L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhEQUE2RTtBQUU3RSx5RUFBaUQ7QUFDakQsb0RBQStEO0FBQy9ELGtDQUE4QztBQUM5Qyx3Q0FBK0Q7QUFDL0Qsd0RBQWdDO0FBQ2hDLHVDQUFxQztBQUU5QixLQUFLLFVBQVUsZ0JBQWdCLENBQ3BDLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHO1lBQ2IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNyQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDdkIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVE7U0FDcEMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3ZFLE1BQU0sVUFBVSxHQUFHLE1BQU0sYUFBYSxDQUFDO1lBQ3JDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMvRCxDQUFDLENBQUM7UUFDSCxJQUFJLFVBQVUsRUFBRTtZQUNkLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxtQ0FBdUI7Z0JBQ2hDLE9BQU8sRUFBRSxtQkFBbUIsVUFBVSxhQUFWLFVBQVUsdUJBQVYs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