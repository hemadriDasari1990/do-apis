"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDepartmentToOrganization = exports.deleteOrganization = exports.getOrganizationDetails = exports.login = exports.createOrganization = void 0;
const organizationFilters_1 = require("../../util/organizationFilters");
const organization_1 = __importDefault(require("../../models/organization"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
async function createOrganization(req, res) {
    try {
        const organization = await getOrganizationByUniqueKey(req.body.uniqueKey);
        if (organization) {
            return res.status(400).json({ message: "Requested organization unique key already exist" });
        }
        const newOrganization = new organization_1.default({
            title: req.body.title,
            description: req.body.description,
            uniqueKey: req.body.uniqueKey,
            password: req.body.password
        });
        const salt = await bcryptjs_1.default.genSalt(10);
        if (!salt)
            throw salt;
        const hash = await bcryptjs_1.default.hash(newOrganization.password, salt);
        if (!hash)
            throw hash;
        newOrganization.password = hash;
        const newOrg = await newOrganization.save();
        return res.status(200).json(newOrg);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.createOrganization = createOrganization;
;
async function login(req, res) {
    try {
        const uniqueKey = req.body.uniqueKey;
        const password = req.body.password;
        const organization = await getOrganizationByUniqueKey(uniqueKey);
        if (!(organization === null || organization === void 0 ? void 0 : organization._id)) {
            return res.status(404).json({ message: "Invalid unique key" });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, organization.password);
        if (!isPasswordValid)
            return res.status(404).json({ message: "Invalid Password" });
        const payload = {
            _id: organization._id,
            title: organization.title
        };
        // Sign token
        const token = await jsonwebtoken_1.default.sign(payload, config_1.default.get("secret"), {
            expiresIn: 31556926 // 1 year in seconds
        });
        if (!token) {
            return res.status(500).json({ message: "Error while logging in" });
        }
        return res.status(200).json({
            success: true,
            token: "Bearer " + token
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.login = login;
;
async function getOrganizationDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const organizations = await organization_1.default.aggregate([
            { "$match": query },
            organizationFilters_1.departmentsLookup,
            organizationFilters_1.organizationAddFields,
        ]);
        return res.status(200).json(organizations ? organizations[0] : null);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getOrganizationDetails = getOrganizationDetails;
async function deleteOrganization(req, res, next) {
    try {
        const deleted = await organization_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res.status(200).json({ message: "Resource has been deleted successfully" });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteOrganization = deleteOrganization;
async function getOrganizationByUniqueKey(uniqueKey) {
    try {
        const organization = await organization_1.default.findOne({ uniqueKey });
        return organization;
    }
    catch (err) {
        return err || err.message;
    }
}
async function addDepartmentToOrganization(departmentId, organizationId) {
    try {
        if (!organizationId || !departmentId) {
            return;
        }
        const organization = await organization_1.default.findByIdAndUpdate(organizationId, { $push: { departments: departmentId } }, { new: true, useFindAndModify: false });
        return organization;
    }
    catch (err) {
        throw 'Cannot add department to organization';
    }
}
exports.addDepartmentToOrganization = addDepartmentToOrganization;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9vcmdhbml6YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0VBR3dDO0FBRXhDLDZFQUFxRDtBQUNyRCx3REFBOEI7QUFDOUIsb0RBQTRCO0FBQzVCLGdFQUErQjtBQUMvQix3REFBZ0M7QUFFekIsS0FBSyxVQUFVLGtCQUFrQixDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ2xFLElBQUk7UUFDRixNQUFNLFlBQVksR0FBRyxNQUFNLDBCQUEwQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUUsSUFBRyxZQUFZLEVBQUM7WUFDZCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGlEQUFpRCxFQUFFLENBQUMsQ0FBQztTQUM3RjtRQUNELE1BQU0sZUFBZSxHQUF5QixJQUFJLHNCQUFZLENBQUM7WUFDN0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNyQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDN0IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUM1QixDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLGtCQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJO1lBQUUsTUFBTSxJQUFJLENBQUM7UUFDdEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxrQkFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxJQUFJO1lBQUUsTUFBTSxJQUFJLENBQUM7UUFD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