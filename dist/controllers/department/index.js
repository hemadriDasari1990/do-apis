"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProjectToDepartment = exports.deleteDepartment = exports.getDepartmentDetails = exports.updateDepartment = void 0;
const departmentFilters_1 = require("../../util/departmentFilters");
const department_1 = __importDefault(require("../../models/department"));
const organization_1 = require("../organization");
const project_1 = require("../project");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateDepartment(req, res, next) {
    try {
        const update = {
            title: req.body.title,
            description: req.body.description,
            organizationId: req.body.organizationId
        };
        const options = { upsert: true, new: true };
        const updated = await department_1.default.findByIdAndUpdate(req.body.departmentId ? req.body.departmentId : new mongoose_1.default.Types.ObjectId(), update, options);
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
;
async function getDepartmentDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const organizations = await department_1.default.aggregate([
            { "$match": query },
            departmentFilters_1.departmentsLookup,
            departmentFilters_1.departmentAddFields
        ]);
        return res.status(200).json(organizations ? organizations[0] : null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9kZXBhcnRtZW50L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG9FQUdzQztBQUV0Qyx5RUFBaUQ7QUFDakQsa0RBQThEO0FBQzlELHdDQUErRDtBQUMvRCx3REFBZ0M7QUFFekIsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7SUFDcEYsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFHO1lBQ2IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNyQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLGNBQWMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWM7U0FDeEMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDNUMsTUFBTSxPQUFPLEdBQVEsTUFBTSxvQkFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUMsSUFBSSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkosSUFBRyxDQUFDLE9BQU8sRUFBQztZQUFFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQUM7UUFDcEMsTUFBTSwwQ0FBMkIsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxP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