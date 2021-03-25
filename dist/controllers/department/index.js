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
        return departments;
    }
    catch (err) {
        return err;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9kZXBhcnRtZW50L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhEQUE2RTtBQUU3RSx5RUFBaUQ7QUFDakQsb0RBQStEO0FBQy9ELGtDQUE4QztBQUM5Qyx3Q0FBK0Q7QUFDL0Qsd0RBQWdDO0FBRXpCLEtBQUssVUFBVSxnQkFBZ0IsQ0FDcEMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUc7WUFDYixLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3JCLFdBQVcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDakMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUN2QixNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUTtTQUNwQyxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDdkUsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLENBQUM7WUFDckMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQy9ELENBQUMsQ0FBQztRQUNILElBQUksVUFBVSxFQUFFO1lBQ2QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLG1DQUF1QjtnQkFDaEMsT0FBTyxFQUFFLG1CQUFtQixVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsS0FB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