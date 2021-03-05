"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDepartmentToOrganization = exports.getOrganizationByEmail = exports.deleteOrganization = exports.getOrganizationDetails = exports.resendActivationLink = exports.confirmEmail = exports.createOrganization = void 0;
const organizationFilters_1 = require("../../util/organizationFilters");
const email_1 = __importDefault(require("../../services/email"));
const organization_1 = __importDefault(require("../../models/organization"));
const token_1 = __importDefault(require("../../models/token"));
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
// import bcrypt from "bcrypt";
const mongoose_1 = __importDefault(require("mongoose"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9vcmdhbml6YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0VBR3dDO0FBRXhDLGlFQUFnRDtBQUNoRCw2RUFBcUQ7QUFDckQsK0RBQXVDO0FBQ3ZDLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsK0JBQStCO0FBQy9CLHdEQUFnQztBQUV6QixLQUFLLFVBQVUsa0JBQWtCLENBQ3RDLEdBQVksRUFDWixHQUFhO0lBRWIsSUFBSTtRQUNGLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxlQUFZLEVBQUUsQ0FBQztRQUM5QyxNQUFNLFlBQVksR0FBRyxNQUFNLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEUsSUFBSSxZQUFZLElBQUksRUFBQyxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsVUFBVSxDQUFBLEVBQUU7WUFDN0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsT0FBTyxFQUFFLG1DQUFtQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssOERBQThEO2FBQ3pILENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxZQUFZLEtBQUksWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLFVBQVUsQ0FBQSxFQUFFO1lBQzVDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLE9BQU8sRUFBRSxtQ0FBbUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLDRDQUE0QzthQUN2RyxDQUFDLENBQUM7U0FDSjtRQUVELG1FQUFtRTtRQUNuRSx1QkFBdUI7UUFDdkIsZUFBZTtRQUNm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