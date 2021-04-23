"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateName = exports.updatePassword = exports.updateEmail = exports.addProjectToUser = exports.addMemberToUser = exports.addTeamToUser = exports.addDepartmentToUser = exports.getUserByEmail = exports.deleteUser = exports.getAllSummary = exports.getBoardsByUser = exports.getUsers = exports.getUserSummary = exports.getUserDetails = exports.resendActivationLink = exports.confirmEmail = exports.createUser = void 0;
const constants_1 = require("../../util/constants");
const projectFilters_1 = require("../../util/projectFilters");
const memberFilters_1 = require("../../util/memberFilters");
const teamFilters_1 = require("../../util/teamFilters");
const board_1 = __importDefault(require("../../models/board"));
const email_1 = __importDefault(require("../../services/email"));
const project_1 = __importDefault(require("../../models/project"));
const token_1 = __importDefault(require("../../models/token"));
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("../../util");
const mongoose_1 = __importDefault(require("mongoose"));
// import { sectionAddFields, sectionsLookup } from "../../util/sectionFilters";
async function createUser(req, res) {
    var _a, _b;
    try {
        const emailService = await new email_1.default();
        const user = await getUserByEmail(req.body.email);
        if (user && !(user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(400).json({
                errorId: constants_1.USER_ALREADY_EXIST,
                message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
            });
        }
        if (user && (user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(400).json({
                errorId: constants_1.EMAIL_VERIFIED,
                message: `An account with following email ${req.body.email} already exist and verified. Please login!`,
            });
        }
        if (((_a = req.body.password) === null || _a === void 0 ? void 0 : _a.trim()) !== ((_b = req.body.confirmPassword) === null || _b === void 0 ? void 0 : _b.trim())) {
            return res.status(400).json({
                errorId: constants_1.EMAIL_VERIFIED,
                message: `Password and Confirm Password do not match`,
            });
        }
        const newUser = new user_1.default({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            newEmail: req.body.email,
            password: req.body.password,
            isAgreed: req.body.isAgreed,
        });
        const newOrg = await newUser.save();
        newOrg.password = undefined;
        const token = new token_1.default({
            userId: newUser._id,
            token: crypto_1.default.randomBytes(16).toString("hex"),
        });
        const newToken = await token.save();
        //@TODO - Send Email Activation Link
        await emailService.sendEmail("/templates/account-confirmation.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/verify/${newToken === null || newToken === void 0 ? void 0 : newToken.token}`,
            name: req.body.name,
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
exports.createUser = createUser;
async function confirmEmail(req, res) {
    try {
        const token = await token_1.default.findOne({ token: req.params.token });
        if (!token) {
            return res.status(400).send({
                message: "Your verification link may have expired. Please click on resend for verify your Email.",
            });
        }
        const user = await user_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(token.userId),
            email: req.params.email,
        });
        if (!user) {
            return res.status(401).send({
                message: `We are unable to find a user account associated with ${req.params.email} for this verification. Please SignUp!`,
            });
        }
        if (user.isVerified) {
            return res
                .status(200)
                .send("User has been already verified. Please Login");
        }
        user.isVerified = true;
        await user.save();
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
        const user = await user_1.default.findOne({
            email: req.params.email,
        });
        if (!user) {
            return res.status(401).send({
                message: `We are unable to find an user account associated with ${req.body.email}. Make sure your Email is correct!`,
            });
        }
        if (user.isVerified) {
            return res
                .status(200)
                .send("User has been already verified. Please Login");
        }
        const token = new token_1.default({
            userId: user._id,
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
async function getUserDetails(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const aggregators = [
            { $match: query },
            teamFilters_1.teamsLookup,
            teamFilters_1.teamAddFields,
            memberFilters_1.membersLookup,
            memberFilters_1.memberAddFields,
            projectFilters_1.projectsLookup,
            projectFilters_1.projectAddTotalFields,
        ];
        const users = await user_1.default.aggregate(aggregators);
        const user = users ? users[0] : null;
        if (user) {
            user.password = undefined;
            user.token = undefined;
            return res.status(200).json(user);
        }
        return res.status(401).json({ code: constants_1.UNAUTHORIZED });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getUserDetails = getUserDetails;
async function getUserSummary(req, res) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(req.params.id) };
        const userSummary = await user_1.default.aggregate([
            { $match: query },
            projectFilters_1.activeProjectsLookup,
            projectFilters_1.inActiveProjectsLookup,
            projectFilters_1.projectsLookup,
            projectFilters_1.projectAddFields,
            teamFilters_1.teamsLookup,
            teamFilters_1.teamAddFields,
            memberFilters_1.membersLookup,
            memberFilters_1.memberAddFields,
        ]);
        const user = userSummary ? userSummary[0] : null;
        if (user) {
            user.password = undefined;
            user.token = undefined;
        }
        return res.status(200).json(user);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getUserSummary = getUserSummary;
async function getUsers(req, res) {
    try {
        console.log(req);
        const users = await user_1.default.find({}).select({
            name: 1,
            isVerified: 1,
            description: 1,
            _id: 0,
        });
        return res.status(200).json({
            users,
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getUsers = getUsers;
async function getBoardsByUser(req, res) {
    try {
        const query = {
            _id: mongoose_1.default.Types.ObjectId(req.params.id),
        };
        const aggregators = [
            { $match: query },
            projectFilters_1.projectsLookup,
            {
                $unwind: "$projects",
            },
            {
                $unwind: "$projects.boards",
            },
            { $replaceRoot: { newRoot: "$projects.boards" } },
            {
                $sort: {
                    _id: -1,
                },
            },
            { $limit: parseInt(req.query.limit) },
        ];
        const boards = await user_1.default.aggregate(aggregators);
        return res.status(200).send(boards);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getBoardsByUser = getBoardsByUser;
async function getAllSummary(req, res) {
    try {
        console.log(req);
        const usersCount = await user_1.default.find({}).count();
        const projectsCount = await project_1.default.find({}).count();
        const boardsCount = await board_1.default.find({}).count();
        return res.status(200).json({
            usersCount,
            projectsCount,
            boardsCount,
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getAllSummary = getAllSummary;
async function deleteUser(req, res, next) {
    try {
        const deleted = await user_1.default.findByIdAndRemove(req.params.id);
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
exports.deleteUser = deleteUser;
async function getUserByEmail(email) {
    try {
        const user = await user_1.default.findOne({ email: email });
        return user;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.getUserByEmail = getUserByEmail;
async function addDepartmentToUser(departmentId, userId) {
    try {
        if (!userId || !departmentId) {
            return;
        }
        const user = await user_1.default.findByIdAndUpdate(userId, { $push: { departments: departmentId } }, { new: true, useFindAndModify: false });
        return user;
    }
    catch (err) {
        throw "Cannot add department to user";
    }
}
exports.addDepartmentToUser = addDepartmentToUser;
async function addTeamToUser(teamId, userId) {
    try {
        if (!userId || !teamId) {
            return;
        }
        const user = await user_1.default.findByIdAndUpdate(userId, { $push: { teams: teamId } }, { new: true, useFindAndModify: false });
        return user;
    }
    catch (err) {
        throw "Cannot add team" + err || err.message;
    }
}
exports.addTeamToUser = addTeamToUser;
async function addMemberToUser(memberId, userId) {
    try {
        if (!userId || !memberId) {
            return;
        }
        const user = await user_1.default.findByIdAndUpdate(userId, { $push: { members: memberId } }, { new: true, useFindAndModify: false });
        return user;
    }
    catch (err) {
        throw "Cannot add team" + err || err.message;
    }
}
exports.addMemberToUser = addMemberToUser;
async function addProjectToUser(projectId, userId) {
    try {
        if (!projectId || !userId) {
            return;
        }
        const updated = await user_1.default.findByIdAndUpdate(userId, { $push: { projects: projectId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding project to user ${err || err.message}`;
    }
}
exports.addProjectToUser = addProjectToUser;
async function updateEmail(req, res) {
    var _a, _b, _c, _d, _e, _f;
    try {
        if (!((_b = (_a = req.body.email) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.length) ||
            !((_d = (_c = req.body.password) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length) ||
            !((_f = (_e = req.body.currentEmail) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.length)) {
            return;
        }
        const user = await util_1.getUser(req.headers.authorization);
        const userFromDb = await user_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id),
        });
        if (!userFromDb) {
            return res.status(500).json({
                errorId: constants_1.USER_NOT_FOUND,
                errorMessage: "User not found",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(req.body.password, userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.password);
        if (!isPasswordValid) {
            return res.status(422).json({
                errorId: constants_1.INCORRECT_PASSWORD,
                errorMessage: "Incorrect Password",
            });
        }
        const emailService = await new email_1.default();
        const query = { _id: mongoose_1.default.Types.ObjectId(userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb._id) }, update = {
            $set: {
                newEmail: req.body.email,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updatedUser = await user_1.default.findOneAndUpdate(query, update, options);
        const tokenQuery = { userId: updatedUser._id }, updateToken = {
            $set: {
                userId: updatedUser._id,
                token: crypto_1.default.randomBytes(16).toString("hex"),
            },
        }, tokenOptions = { upsert: true, new: true, setDefaultsOnInsert: true };
        const newToken = await token_1.default.findOneAndUpdate(tokenQuery, updateToken, tokenOptions);
        await emailService.sendEmail("/templates/account-confirmation.ejs", {
            url: config_1.default.get("url"),
            confirm_link: `${config_1.default.get("url")}/verify/${newToken === null || newToken === void 0 ? void 0 : newToken.token}`,
            name: updatedUser.name,
        }, req.body.email, "Please confirm your email");
        return res.status(200).send({
            updated: true,
            message: "We've sent an email confirmation link to your new email address. Please check your inbox",
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateEmail = updateEmail;
async function updatePassword(req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        if (!((_b = (_a = req.body.newPassword) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.length) ||
            !((_d = (_c = req.body.currentPassword) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length) ||
            !((_f = (_e = req.body.newConfirmPassword) === null || _e === void 0 ? void 0 : _e.trim()) === null || _f === void 0 ? void 0 : _f.length)) {
            return;
        }
        if (((_g = req.body.newPassword) === null || _g === void 0 ? void 0 : _g.trim()) !== ((_h = req.body.newConfirmPassword) === null || _h === void 0 ? void 0 : _h.trim())) {
            return res.status(422).json({
                errorId: constants_1.PASSWORDS_ARE_NOT_SAME,
                errorMessage: "New password and re entered one are not same. Please check",
            });
        }
        const user = await util_1.getUser(req.headers.authorization);
        const userFromDb = await user_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id),
        });
        if (!userFromDb) {
            return res.status(500).json({
                errorId: constants_1.USER_NOT_FOUND,
                errorMessage: "User not found",
            });
        }
        const isCurrentPasswordSame = await bcrypt_1.default.compare((_j = req.body.currentPassword) === null || _j === void 0 ? void 0 : _j.trim(), (_k = userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.password) === null || _k === void 0 ? void 0 : _k.trim());
        if (!isCurrentPasswordSame) {
            return res.status(422).json({
                errorId: constants_1.PASSWORDS_ARE_NOT_SAME,
                errorMessage: "You've provide incorrect current password. Please check",
            });
        }
        const isPasswordSame = await bcrypt_1.default.compare((_l = req.body.newPassword) === null || _l === void 0 ? void 0 : _l.trim(), (_m = userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.password) === null || _m === void 0 ? void 0 : _m.trim());
        if (isPasswordSame) {
            return res.status(422).json({
                errorId: constants_1.PASSWORDS_ARE_SAME,
                errorMessage: "New password can't be same as old password. Please choose different one",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash((_o = req.body.newPassword) === null || _o === void 0 ? void 0 : _o.trim(), Number(config_1.default.get("bcryptSalt")));
        const update = {
            $set: {
                password: hashedPassword,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await user_1.default.findByIdAndUpdate(mongoose_1.default.Types.ObjectId(userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb._id), update, options);
        return res.status(200).send({
            updated: true,
            message: "Your password is successfully changed. Please login with new password",
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updatePassword = updatePassword;
async function updateName(req, res) {
    var _a, _b;
    try {
        if (!((_b = (_a = req.body.name) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.length)) {
            return;
        }
        const user = await util_1.getUser(req.headers.authorization);
        const userFromDb = await user_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id),
        });
        if (!userFromDb) {
            return res.status(500).json({
                errorId: constants_1.USER_NOT_FOUND,
                errorMessage: "User not found",
            });
        }
        const query = { _id: mongoose_1.default.Types.ObjectId(userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb._id) }, update = {
            $set: {
                name: req.body.name,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        await user_1.default.findOneAndUpdate(query, update, options);
        return res.status(200).send({
            updated: true,
            message: "Name has been updated successfully",
        });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.updateName = updateName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy91c2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQVE4QjtBQUU5Qiw4REFNbUM7QUFDbkMsNERBQTBFO0FBQzFFLHdEQUFvRTtBQUVwRSwrREFBdUM7QUFDdkMsaUVBQWdEO0FBQ2hELG1FQUEyQztBQUMzQywrREFBdUM7QUFDdkMsNkRBQXFDO0FBQ3JDLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLHFDQUFxQztBQUNyQyx3REFBZ0M7QUFFaEMsZ0ZBQWdGO0FBRXpFLEtBQUssVUFBVSxVQUFVLENBQUMsR0FBWSxFQUFFLEdBQWE7O0lBQzFELElBQUk7UUFDRixNQUFNLFlBQVksR0FBRyxNQUFNLElBQUksZUFBWSxFQUFFLENBQUM7UUFDOUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLElBQUksSUFBSSxFQUFDLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxVQUFVLENBQUEsRUFBRTtZQUM3QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsOEJBQWtCO2dCQUMzQixPQUFPLEVBQUUsbUNBQW1DLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyw4REFBOEQ7YUFDekgsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLElBQUksS0FBSSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsVUFBVSxDQUFBLEVBQUU7WUFDNUIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLDBCQUFjO2dCQUN2QixPQUFPLEVBQUUsbUNBQW1DLEdBQUcsQ0FBQyxJQUFJ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