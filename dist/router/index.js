"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("../controllers/team");
const auth_1 = require("../controllers/auth");
const feedback_1 = require("../controllers/feedback");
const section_1 = require("../controllers/section");
const user_1 = require("../controllers/user");
const board_1 = require("../controllers/board");
const department_1 = require("../controllers/department");
const member_1 = require("../controllers/member");
const note_1 = require("../controllers/note");
const project_1 = require("../controllers/project");
const express_1 = __importDefault(require("express"));
const reaction_1 = require("../controllers/reaction");
const auth_2 = require("../controllers/auth");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), authRoutes = express_1.default.Router(), userRoutes = express_1.default.Router(), departmentRoutes = express_1.default.Router(), projectRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), reactionRoutes = express_1.default.Router(), teamRoutes = express_1.default.Router(), memberRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router();
    //= ========================
    // Authentication Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/auth", authRoutes);
    // Login
    authRoutes.post("/login", auth_1.login);
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
    teamRoutes.get("/", auth_1.authenticateJWT, team_1.getTeams);
    // Create or Update Team
    teamRoutes.put("/", auth_1.authenticateJWT, team_1.updateTeam);
    // Create or Update Team
    teamRoutes.put("/:id/member", auth_1.authenticateJWT, team_1.addOrRemoveMemberFromTeam);
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
    // Department Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/department", departmentRoutes);
    // Department details route
    departmentRoutes.get("/:id", auth_1.authenticateJWT, department_1.getDepartmentDetails);
    // Create or Update Department
    departmentRoutes.put("/", auth_1.authenticateJWT, department_1.updateDepartment);
    // Department delete route
    departmentRoutes.delete("/:id", auth_1.authenticateJWT, department_1.deleteDepartment);
    //= ========================
    // Project Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/project", projectRoutes);
    // Project details route
    projectRoutes.get("/:id", auth_1.authenticateJWT, project_1.getProjectDetails);
    // Create or Update Project
    projectRoutes.put("/", auth_1.authenticateJWT, project_1.updateProject);
    // Project delete route
    projectRoutes.delete("/:id", auth_1.authenticateJWT, project_1.deleteProject);
    //= ========================
    // Board Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/board", boardRoutes);
    // Board details route
    boardRoutes.get("/:id", board_1.getBoardDetails);
    // Update or Create board
    boardRoutes.put("/", auth_1.authenticateJWT, board_1.updateBoard);
    // Board delete route
    boardRoutes.delete("/:id", auth_1.authenticateJWT, board_1.deleteBoard);
    // Start or complete the board
    boardRoutes.put("/session/:action", auth_1.authenticateJWT, board_1.startOrCompleteBoard);
    //= ========================
    // Section Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/section", sectionRoutes);
    // Section details route
    sectionRoutes.get("/:boardId", section_1.getSectionsByBoardId);
    // Section creation route
    sectionRoutes.post("/", auth_1.authenticateJWT, section_1.createSection);
    // Update or Create Section
    sectionRoutes.put("/", auth_1.authenticateJWT, section_1.updateSection);
    // Section delete route
    sectionRoutes.delete("/:id", auth_1.authenticateJWT, section_1.deleteSection);
    //= ========================
    // Note Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/note", noteRoutes);
    // Note details route
    noteRoutes.get("/:sectionId", note_1.getNotesBySectionId);
    // Note or Create board
    noteRoutes.put("/", note_1.updateNote);
    // Mark read
    noteRoutes.put("/:id/mark-read", auth_1.authenticateJWT, note_1.markReadNote);
    // Note delete route
    noteRoutes.delete("/:id", auth_1.authenticateJWT, note_1.deleteNote);
    //= ========================
    // Like Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/react", reactionRoutes);
    // Like creation route
    reactionRoutes.put("/", reaction_1.createOrUpdateReaction);
    //= ========================
    // Feedback Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/feedback", feedbackRoutes);
    // Feedback creation route
    feedbackRoutes.post("/", feedback_1.createFeedback);
    // Get Feedbacks
    feedbackRoutes.get("/", feedback_1.getFeedbacks);
    // Set url for API group routes
    app.use("/", apiRoutes);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FLNkI7QUFDN0IsOENBUTZCO0FBQzdCLHNEQUF1RTtBQUN2RSxvREFLZ0M7QUFDaEMsOENBTzZCO0FBQzdCLGdEQUs4QjtBQUM5QiwwREFJbUM7QUFDbkMsa0RBSytCO0FBQy9CLDhDQUs2QjtBQUM3QixvREFJZ0M7QUFDaEMsc0RBQStDO0FBRS9DLHNEQUFpRTtBQUNqRSw4Q0FBbUQ7QUFFbkQsbUJBQXdCLEdBQWdCO0lBQ3RDLDRCQUE0QjtJQUM1QixNQUFNLFNBQVMsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDN0IsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLGdCQUFnQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ25DLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDOUIsYUFBYSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDakMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLFlBQVksR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUMvQixjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVwQyw0QkFBNEI7SUFDNUIsd0JBQXdCO0lBQ3hCLDRCQUE0QjtJQUU1QixzREFBc0Q7SUFDdEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFbkMsUUFBUTtJQUNSLFVBQVUsQ0FBQyxJQUFJ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