"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDepartmentToOrganization = exports.getOrganizationByEmail = exports.deleteOrganization = exports.getOrganizationSummary = exports.getOrganizationDetails = exports.resendActivationLink = exports.confirmEmail = exports.createOrganization = void 0;
const departmentFilters_1 = require("../../util/departmentFilters");
const email_1 = __importDefault(require("../../services/email"));
const organization_1 = __importDefault(require("../../models/organization"));
const token_1 = __importDefault(require("../../models/token"));
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
// import bcrypt from "bcrypt";
const mongoose_1 = __importDefault(require("mongoose"));
const organizationFilters_1 = require("../../util/organizationFilters");
async function createOrganization(req, res) {
    try {
        const emailService = await new email_1.default();
        const organization = await getOrganizationByEmail(req.body.email);
        if (organization && !(organization === null || organization === void 0 ? void 0 : organization.isVerified)) {
            return res.status(400).json({
                errorId: "ORGANIZATION_ALREADY_EXIST",
                message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
            });
        }
        if (organization && (organization === null || organization === void 0 ? void 0 : organization.isVerified)) {
            return res.status(400).json({
                errorId: "EMAIL_VERIFIED",
                message: `An account with following email ${req.body.email} already exist and verified. Please login!`,
            });
        }
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // if(!hashedPassword){
        //   return res
        //       .status(400)
        //       .json({ message: 'Error hashing password' });
        // }
        const newOrganization = new organization_1.default({
            title: req.body.title,
            description: req.body.description,
            email: req.body.email,
            password: req.body.password,
        });
        const newOrg = await newOrganization.save();
        newOrg.password = undefined;
        const token = new token_1.default({
            organizationId: newOrganization._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        const newToken = await token.save();
        //@TODO - Send Email Activation Link
        await emailService.sendEmail("/templates/account-confirmation.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/verify/${newToken === null || newToken === void 0 ? void 0 : newToken.token}`,
            name: req.body.title,
        }, req.body.email, "Please confirm your email");
        return res.status(200).json({
            message: "An email verification link has been sent. Please check your inbox",
            newOrg,
        });
    }
    catch (err) {
        return res.status(500).json(err || err.message);
    }
}
exports.createOrganization = createOrganization;
async function confirmEmail(req, res) {
    try {
        const token = await token_1.default.findOne({ token: req.params.token });
        if (!token) {
            return res.status(400).send({
                message: "Your verification link may have expired. Please click on resend for verify your Email.",
            });
        }
        const organization = await organization_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(token.organizationId),
            email: req.params.email,
        });
        if (!organization) {
            return res.status(401).send({
                message: `We are unable to find a organization account associated with ${req.params.email} for this verification. Please SignUp!`,
            });
        }
        if (organization.isVerified) {
            return res
                .status(200)
                .send("Organization has been already verified. Please Login");
        }
        organization.isVerified = true;
        await organization.save();
        //@TODO - Send successfully verified Email
        return res
            .status(200)
            .send("Your account has been successfully verified. Please login now");
    }
    catch (err) {
        return res.status(500).json(err || err.message);
    }
}
exports.confirmEmail = confirmEmail;
async function resendActivationLink(req, res) {
    try {
        const organization = await organization_1.default.findOne({
            email: req.params.email,
        });
        if (!organization) {
            return res.status(401).send({
                message: `We are unable to find an organization account associated with ${req.body.email}. Make sure your Email is correct!`,
            });
        }
        if (organization.isVerified) {
            return res
                .status(200)
                .send("Organization has been already verified. Please Login");
        }
        const token = new token_1.default({
            organizationId: organization._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        await token.save();
        //@TODO - Send Email Activation Link
    }
    catch (err) {
        return res.status(500).json(err || err.message);
    }
}
exports.resendActivationLink = resendActivationLink;
async function getOrganizationDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const organizations = await organization_1.default.aggregate([
            { $match: query },
            departmentFilters_1.departmentsLookup,
            departmentFilters_1.departmentAddFields,
        ]);
        const org = organizations ? organizations[0] : null;
        if (org) {
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
async function getOrganizationSummary(req, res) {
    try {
        console.log("id...", req.params.id);
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const organizationSummary = await organization_1.default.aggregate([
            { $match: query },
            organizationFilters_1.organizationLookup,
        ]).allowDiskUse(true);
        const org = organizationSummary ? organizationSummary[0] : null;
        if (org) {
            org.password = undefined;
            org.token = undefined;
        }
        return res.status(200).json(org);
    }
    catch (err) {
        console.log("check", err, req.params.id);
        return res.status(500).send(err || err.message);
    }
}
exports.getOrganizationSummary = getOrganizationSummary;
async function deleteOrganization(req, res, next) {
    try {
        const deleted = await organization_1.default.findByIdAndRemove(req.params.id);
        if (!deleted) {
            res.status(500).json({ message: `Cannot delete resource` });
            return next(deleted);
        }
        return res
            .status(200)
            .json({ message: "Resource has been deleted successfully" });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.deleteOrganization = deleteOrganization;
async function getOrganizationByEmail(email) {
    try {
        const organization = await organization_1.default.findOne({ email: email });
        return organization;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.getOrganizationByEmail = getOrganizationByEmail;
async function addDepartmentToOrganization(departmentId, organizationId) {
    try {
        if (!organizationId || !departmentId) {
            return;
        }
        const organization = await organization_1.default.findByIdAndUpdate(organizationId, { $push: { departments: departmentId } }, { new: true, useFindAndModify: false });
        return organization;
    }
    catch (err) {
        throw "Cannot add department to organization";
    }
}
exports.addDepartmentToOrganization = addDepartmentToOrganization;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9vcmdhbml6YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0VBR3NDO0FBRXRDLGlFQUFnRDtBQUNoRCw2RUFBcUQ7QUFDckQsK0RBQXVDO0FBQ3ZDLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsK0JBQStCO0FBQy9CLHdEQUFnQztBQUNoQyx3RUFBb0U7QUFFN0QsS0FBSyxVQUFVLGtCQUFrQixDQUN0QyxHQUFZLEVBQ1osR0FBYTtJQUViLElBQUk7UUFDRixNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksZUFBWSxFQUFFLENBQUM7UUFDOUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xFLElBQUksWUFBWSxJQUFJLEVBQUMsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQSxFQUFFO1lBQzdDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSw0QkFBNEI7Z0JBQ3JDLE9BQU8sRUFBRSxtQ0FBbUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLDhEQUE4RDthQUN6SCxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksWUFBWSxLQUFJLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxVQUFVLENBQUEsRUFBRTtZQUM1QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsZ0JBQWdCO2dCQUN6QixPQUFPLEVBQUUsbUNBQW1DLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyw0Q0FBNEM7YUFDdkcsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxtRUFBbUU7UUFDbkUsdUJBQXVCO1FB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