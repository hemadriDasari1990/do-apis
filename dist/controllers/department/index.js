"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProjectToDepartment = exports.deleteDepartment = exports.getDepartmentDetails = exports.updateDepartment = void 0;
const projectFilters_1 = require("../../util/projectFilters");
const department_1 = __importDefault(require("../../models/department"));
const organization_1 = require("../organization");
const project_1 = require("../project");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateDepartment(req, res, next) {
    try {
        const update = {
            title: req.body.title,
            description: req.body.description,
            organizationId: req.body.organizationId,
            status: req.body.status || "active",
        };
        const options = { upsert: true, new: true };
        const updated = await department_1.default.findByIdAndUpdate(req.body.departmentId
            ? req.body.departmentId
            : new mongoose_1.default.Types.ObjectId(), update, options);
        if (!updated) {
            return next(updated);
        }
        await organization_1.addDepartmentToOrganization(updated === null || updated === void 0 ? void 0 : updated._id, req.body.organizationId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9kZXBhcnRtZW50L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhEQUE2RTtBQUU3RSx5RUFBaUQ7QUFDakQsa0RBQThEO0FBQzlELHdDQUErRDtBQUMvRCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLGdCQUFnQixDQUNwQyxHQUFZLEVBQ1osR0FBYSxFQUNiLElBQWtCO0lBRWxCLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRztZQUNiLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDckIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVztZQUNqQyxjQUFjLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjO1lBQ3ZDLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRO1NBQ3BDLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQzVDLE1BQU0sT0FBTyxHQUFRLE1BQU0sb0JBQVUsQ0FBQyxpQkFBaUIsQ0FDckQsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQ25CLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFDdkIsQ0FBQyxDQUFDLElBQUksa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQ2pDLE1BQU0sRUFDTixPQUFPLENBQ1IsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0QjtRQUNELE1BQU0sMENBQTJCLENBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FB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