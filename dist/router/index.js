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
const auth_2 = require("../controllers/auth");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), authRoutes = express_1.default.Router(), userRoutes = express_1.default.Router(), departmentRoutes = express_1.default.Router(), projectRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), teamRoutes = express_1.default.Router(), memberRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router();
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
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/note", noteRoutes);
    // Note details route
    noteRoutes.get("/:sectionId", note_1.getNotesBySectionId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FNNkI7QUFDN0IsOENBUTZCO0FBQzdCLHNEQUF1RTtBQUN2RSxvREFBOEQ7QUFDOUQsOENBTzZCO0FBQzdCLGdEQUk4QjtBQUM5QiwwREFJbUM7QUFDbkMsa0RBSytCO0FBQy9CLDhDQUEwRDtBQUMxRCxvREFJZ0M7QUFDaEMsc0RBQStDO0FBRS9DLDhDQUEyRDtBQUUzRCxtQkFBd0IsR0FBZ0I7SUFDdEMsNEJBQTRCO0lBQzVCLE1BQU0sU0FBUyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixVQUFVLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDN0IsZ0JBQWdCLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDbkMsYUFBYSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM5QixhQUFhLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixZQUFZLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDL0IsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFcEMsNEJBQTRCO0lBQzVCLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFFNUIsc0RBQXNEO0lBQ3RELFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLFFBQVE7SUFDUixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFLLENBQUMsQ0FBQztJQUVqQyxTQUFTO0lBQ1QsVUFB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