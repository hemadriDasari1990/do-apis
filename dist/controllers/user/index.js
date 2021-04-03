"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBoardToUser = exports.addMemberToUser = exports.addTeamToUser = exports.addDepartmentToUser = exports.getUserByEmail = exports.deleteUser = exports.getAllSummary = exports.getUsers = exports.getUserSummary = exports.getUserDetails = exports.resendActivationLink = exports.confirmEmail = exports.createUser = void 0;
const departmentFilters_1 = require("../../util/departmentFilters");
const memberFilters_1 = require("../../util/memberFilters");
const teamFilters_1 = require("../../util/teamFilters");
const board_1 = __importDefault(require("../../models/board"));
const email_1 = __importDefault(require("../../services/email"));
const project_1 = __importDefault(require("../../models/project"));
const token_1 = __importDefault(require("../../models/token"));
const constants_1 = require("../../util/constants");
const user_1 = __importDefault(require("../../models/user"));
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
// import bcrypt from "bcrypt";
const mongoose_1 = __importDefault(require("mongoose"));
const boardFilters_1 = require("../../util/boardFilters");
async function createUser(req, res) {
    try {
        const emailService = await new email_1.default();
        const user = await getUserByEmail(req.body.email);
        if (user && !(user === null || user === void 0 ? void 0 : user.isVerified)) {
            return res.status(400).json({
                errorId: "USER_ALREADY_EXIST",
                message: `An account with following email ${req.body.email} already exist but not verified yet. Please check your inbox`,
            });
        }
        if (user && (user === null || user === void 0 ? void 0 : user.isVerified)) {
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
        const newUser = new user_1.default({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            password: req.body.password,
            isAgreed: req.body.isAgreed,
            accountType: req.body.accountType,
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
        ];
        if (req.query.accountType === "commercial") {
            aggregators.push(departmentFilters_1.departmentsLookup);
            aggregators.push(departmentFilters_1.departmentAddFields);
        }
        if (req.query.accountType === "individual") {
            aggregators.push(boardFilters_1.boardsLookup);
            aggregators.push(boardFilters_1.boardAddFields);
        }
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
            departmentFilters_1.activeDepartmentsLookup,
            departmentFilters_1.departmentsLookup,
            departmentFilters_1.inActiveDepartmentsLookup,
            departmentFilters_1.departmentAddFields,
            teamFilters_1.teamsLookup,
            teamFilters_1.teamAddFields,
            memberFilters_1.membersLookup,
            memberFilters_1.memberAddFields,
        ]);
        const org = userSummary ? userSummary[0] : null;
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
async function addBoardToUser(boardId, userId) {
    try {
        if (!boardId || !userId) {
            return;
        }
        const updated = await user_1.default.findByIdAndUpdate(userId, { $push: { boards: boardId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding board to user ${err || err.message}`;
    }
}
exports.addBoardToUser = addBoardToUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy91c2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG9FQUtzQztBQUN0Qyw0REFBMEU7QUFDMUUsd0RBQW9FO0FBRXBFLCtEQUF1QztBQUN2QyxpRUFBZ0Q7QUFDaEQsbUVBQTJDO0FBQzNDLCtEQUF1QztBQUN2QyxvREFBb0Q7QUFDcEQsNkRBQXFDO0FBQ3JDLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsK0JBQStCO0FBQy9CLHdEQUFnQztBQUNoQywwREFBdUU7QUFFaEUsS0FBSyxVQUFVLFVBQVUsQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUMxRCxJQUFJO1FBQ0YsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFJLGVBQVksRUFBRSxDQUFDO1FBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxJQUFJLElBQUksRUFBQyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsVUFBVSxDQUFBLEVBQUU7WUFDN0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsT0FBTyxFQUFFLG9CQUFvQjtnQkFDN0IsT0FBTyxFQUFFLG1DQUFtQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssOERBQThEO2FBQ3pILENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxJQUFJLEtBQUksSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFVBQVUsQ0FBQSxFQUFFO1lBQzVCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxnQkFBZ0I7Z0JBQ3pCLE9BQU8sRUFBRSxtQ0FBbUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLDRD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