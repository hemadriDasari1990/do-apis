"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDepartmentToOrganization = exports.getOrganizationByUniqueKey = exports.deleteOrganization = exports.getOrganizationDetails = exports.createOrganization = void 0;
const organizationFilters_1 = require("../../util/organizationFilters");
const organization_1 = __importDefault(require("../../models/organization"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
async function createOrganization(req, res) {
    try {
        const organization = await getOrganizationByUniqueKey(req.body.uniqueKey);
        if (organization) {
            return res.status(400).json({ message: "Requested organization unique key already exist" });
        }
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        const newOrganization = new organization_1.default({
            title: req.body.title,
            description: req.body.description,
            uniqueKey: req.body.uniqueKey,
            password: hashedPassword
        });
        const newOrg = await newOrganization.save();
        newOrg.password = undefined;
        return res.status(200).json(newOrg);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.createOrganization = createOrganization;
;
async function getOrganizationDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const organizations = await organization_1.default.aggregate([
            { "$match": query },
            organizationFilters_1.departmentsLookup,
            organizationFilters_1.organizationAddFields,
        ]);
        const org = organizations ? organizations[0] : null;
        if (org) {
            org.uniqueKey = undefined;
            org.password = undefined;
            org.token = undefined;
        }
        return res.status(200).json(org);
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
exports.getOrganizationByUniqueKey = getOrganizationByUniqueKey;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9vcmdhbml6YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0VBR3dDO0FBRXhDLDZFQUFxRDtBQUNyRCxvREFBNEI7QUFDNUIsd0RBQWdDO0FBRXpCLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUNsRSxJQUFJO1FBQ0YsTUFBTSxZQUFZLEdBQUcsTUFBTSwwQkFBMEIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFFLElBQUcsWUFBWSxFQUFDO1lBQ2QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxpREFBaUQsRUFBRSxDQUFDLENBQUM7U0FDN0Y7UUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLGdCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sZUFBZSxHQUF5QixJQUFJLHNCQUFZLENBQUM7WUFDN0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSztZQUNyQixXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2pDLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFDN0IsUUFBUSxFQUFFLGNBQWM7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUNwQztJQUFDLE9BQU0sR0FBRyxFQUFD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