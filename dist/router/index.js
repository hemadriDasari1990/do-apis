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
const action_1 = require("../controllers/action");
const actionItem_1 = require("../controllers/actionItem");
const activity_1 = require("../controllers/activity");
const invite_1 = require("../controllers/invite");
const note_1 = require("../controllers/note");
const section_1 = require("../controllers/section");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), authRoutes = express_1.default.Router(), userRoutes = express_1.default.Router(), projectRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), teamRoutes = express_1.default.Router(), memberRoutes = express_1.default.Router(), reactionRoutes = express_1.default.Router(), securityQuestionRoutes = express_1.default.Router(), actionRoutes = express_1.default.Router(), actionItemRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router(), inviteRoutes = express_1.default.Router(), activityRoutes = express_1.default.Router();
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
    userRoutes.put("/email", auth_1.authenticateJWT, user_1.updateEmail);
    // Update user route
    userRoutes.put("/name", auth_1.authenticateJWT, user_1.updateName);
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
    // Action Routes
    //= ========================
    // Action routes
    apiRoutes.use("/action", actionRoutes);
    // Action details route
    actionRoutes.get("/:boardId", action_1.getActionByBoardId);
    //= ========================
    // Action item Routes
    //= ========================
    // Set action item routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/action-item", actionItemRoutes);
    // Action item details route
    actionItemRoutes.get("/:actionId", actionItem_1.getActionItemsByActionId);
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
    // Activity Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/activity", activityRoutes);
    // Get Activities
    activityRoutes.get("/", activity_1.getActivities);
    //= ========================
    // Invite Routes
    //= ========================
    // Set invite routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/invite", inviteRoutes);
    // Get Inivted members
    inviteRoutes.get("/", auth_1.authenticateJWT, invite_1.getInvitedMembers);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FNNkI7QUFDN0IsOENBUTZCO0FBQzdCLHNEQUF1RTtBQUN2RSxzRUFHeUM7QUFDekMsa0ZBRytDO0FBQy9DLDhDQVc2QjtBQUM3QixnREFNOEI7QUFDOUIsa0RBSytCO0FBQy9CLG9EQUlnQztBQUNoQyxzREFBK0M7QUFDL0Msc0RBS2lDO0FBQ2pDLDhDQUEyRDtBQUUzRCxrREFBMkQ7QUFDM0QsMERBQXFFO0FBQ3JFLHNEQUF3RDtBQUN4RCxrREFBMEQ7QUFDMUQsOENBQTBEO0FBQzFELG9EQUE4RDtBQUU5RCxtQkFBd0IsR0FBZ0I7SUFDdEMsNEJBQTRCO0lBQzVCLE1BQU0sU0FBUyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixVQUFVLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDN0IsYUFBYSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM5QixhQUFhLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixZQUFZLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDL0IsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2pDLHNCQUFzQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3pDLFlBQVksR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUMvQixnQkFBZ0IsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNuQyxjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVB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