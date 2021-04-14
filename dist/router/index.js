"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("../controllers/team");
const auth_1 = require("../controllers/auth");
const feedback_1 = require("../controllers/feedback");
const securityQuestion_1 = require("../controllers/securityQuestion");
const securityQuestionAnswer_1 = require("../controllers/securityQuestionAnswer");
const user_1 = require("../controllers/user");
const board_1 = require("../controllers/board");
const member_1 = require("../controllers/member");
const project_1 = require("../controllers/project");
const express_1 = __importDefault(require("express"));
const reaction_1 = require("../controllers/reaction");
const auth_2 = require("../controllers/auth");
const note_1 = require("../controllers/note");
const section_1 = require("../controllers/section");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), authRoutes = express_1.default.Router(), userRoutes = express_1.default.Router(), projectRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), teamRoutes = express_1.default.Router(), memberRoutes = express_1.default.Router(), reactionRoutes = express_1.default.Router(), securityQuestionRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router();
    //= ========================
    // Authentication Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/auth", authRoutes);
    // Login
    authRoutes.post("/login", auth_1.login);
    // Logout
    authRoutes.post("/logout", auth_2.logout);
    // refresh token
    authRoutes.post("/refresh-token", auth_2.refreshToken);
    // verify account
    authRoutes.post("/verify-token", auth_1.verifyAccount);
    // resend verification token
    authRoutes.post("/resend-token", auth_1.resendToken);
    // forgot password
    authRoutes.post("/forgot-password", auth_1.forgotPassword);
    // validate forgot password token
    authRoutes.post("/validate-forgot-password", auth_1.validateForgotPassword);
    // reset password
    authRoutes.post("/reset-password", auth_1.resetPassword);
    //= ========================
    // User Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/user", userRoutes);
    // User summary
    userRoutes.get("/summary", user_1.getAllSummary);
    // User names
    userRoutes.get("/", user_1.getUsers);
    // User details route
    userRoutes.get("/:id", auth_1.authenticateJWT, user_1.getUserDetails);
    // Update user route
    userRoutes.put("/", auth_1.authenticateJWT, user_1.updateUser);
    // Update password route
    userRoutes.put("/update-password", auth_1.authenticateJWT, user_1.updatePassword);
    // Get Boards by user
    userRoutes.get("/:id/boards", auth_1.authenticateJWT, user_1.getBoardsByUser);
    // Update or Create User
    userRoutes.post("/", user_1.createUser);
    // User delete route
    userRoutes.delete("/:id", auth_1.authenticateJWT, user_1.deleteUser);
    // User summary
    userRoutes.get("/:id/summary", auth_1.authenticateJWT, user_1.getUserSummary);
    //= ========================
    // Team Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/team", teamRoutes);
    // Team details route
    teamRoutes.get("/", auth_1.authenticateJWT, team_1.getTeamsByUser);
    // Create or Update Team
    teamRoutes.put("/", auth_1.authenticateJWT, team_1.updateTeam);
    // Create or Update Team
    teamRoutes.put("/:id/member", auth_1.authenticateJWT, team_1.addOrRemoveMemberFromTeam);
    // Send invitations to team members
    teamRoutes.post("/invitation", auth_1.authenticateJWT, team_1.sendInvitationToTeams);
    // Team delete route
    teamRoutes.delete("/:id", auth_1.authenticateJWT, team_1.deleteTeam);
    //= ========================
    // Member Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/member", memberRoutes);
    // Get all members
    memberRoutes.get("/", auth_1.authenticateJWT, member_1.getMembersByUser);
    // Member details route
    memberRoutes.get("/:id", auth_1.authenticateJWT, member_1.getMemberDetails);
    // Create or Update Member
    memberRoutes.put("/", auth_1.authenticateJWT, member_1.updateMember);
    // Member delete route
    memberRoutes.delete("/:id", auth_1.authenticateJWT, member_1.deleteMember);
    //= ========================
    // Project Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/project", projectRoutes);
    // Project details route
    projectRoutes.get("/", auth_1.authenticateJWT, project_1.getProjects);
    // Create or Update Project
    projectRoutes.put("/", auth_1.authenticateJWT, project_1.updateProject);
    // Project delete route
    projectRoutes.delete("/:id", auth_1.authenticateJWT, project_1.deleteProject);
    //= ========================
    // Board Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/board", boardRoutes);
    // Get Boards route
    boardRoutes.get("/", board_1.getBoards);
    // Board details route
    boardRoutes.get("/:id", board_1.getBoardDetails);
    // Update or Create board
    boardRoutes.put("/", auth_1.authenticateJWT, board_1.updateBoard);
    // Board delete route
    boardRoutes.delete("/:id", auth_1.authenticateJWT, board_1.deleteBoard);
    // download board report
    boardRoutes.get("/:id/download-report", auth_1.authenticateJWT, board_1.downloadBoardReport);
    //= ========================
    // Section Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/section", sectionRoutes);
    // Section details route
    sectionRoutes.get("/:boardId", section_1.getSectionsByBoardId);
    //= ========================
    // Note Routes
    //= ========================
    // Set note routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/note", noteRoutes);
    // Note details route
    noteRoutes.get("/:sectionId", note_1.getNotesBySectionId);
    //= ========================
    // Reaction Routes
    //= ========================
    // Set reaction routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/reactions", reactionRoutes);
    // Get reactions summary by board ID
    reactionRoutes.get("/:boardId/summary", reaction_1.getReactionSummaryByBoard);
    // Get reactions summary by section ID
    reactionRoutes.get("/:sectionId/section-summary", reaction_1.getReactionSummaryBySection);
    // Get reactions summary by note ID
    reactionRoutes.get("/:noteId/note-summary", reaction_1.getReactionSummaryByNote);
    // Get reactions
    reactionRoutes.get("/", reaction_1.getReactions);
    //= ========================
    // Feedback Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/feedback", feedbackRoutes);
    // Feedback creation route
    feedbackRoutes.post("/", feedback_1.createFeedback);
    // Get Feedbacks
    feedbackRoutes.get("/", feedback_1.getFeedbacks);
    //= ========================
    // Security Questions Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/security-question", securityQuestionRoutes);
    // Get Security Questions
    securityQuestionRoutes.get("/", auth_1.authenticateJWT, securityQuestion_1.getSecurityQuestions);
    // Get Security Questions
    securityQuestionRoutes.post("/", auth_1.authenticateJWT, securityQuestion_1.createSecurityQuestion);
    // create Security Question Answer
    securityQuestionRoutes.post("/answer", auth_1.authenticateJWT, securityQuestionAnswer_1.createSecurityQuestionAnswer);
    // Verify Security Question Answer
    securityQuestionRoutes.post("/verify", auth_1.authenticateJWT, securityQuestionAnswer_1.verifySecurityQuestionAnswer);
    // Set url for API group routes
    app.use("/", apiRoutes);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FNNkI7QUFDN0IsOENBUTZCO0FBQzdCLHNEQUF1RTtBQUN2RSxzRUFHeUM7QUFDekMsa0ZBRytDO0FBQy9DLDhDQVU2QjtBQUM3QixnREFNOEI7QUFDOUIsa0RBSytCO0FBQy9CLG9EQUlnQztBQUNoQyxzREFBK0M7QUFDL0Msc0RBS2lDO0FBQ2pDLDhDQUEyRDtBQUUzRCw4Q0FBMEQ7QUFDMUQsb0RBQThEO0FBRTlELG1CQUF3QixHQUFnQjtJQUN0Qyw0QkFBNEI7SUFDNUIsTUFBTSxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixhQUFhLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsV0FBVyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzlCLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDN0IsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLFlBQVksR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUMvQixjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDakMsc0JBQXNCLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDekMsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFcEMsNEJBQTRCO0lBQzVCLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFFNUIsc0RBQXNEO0lBQ3RELFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLFFBQVE7SUFDUixV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