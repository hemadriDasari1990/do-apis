"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../controllers/auth");
const feedback_1 = require("../controllers/feedback");
const organization_1 = require("../controllers/organization");
const section_1 = require("../controllers/section");
const board_1 = require("../controllers/board");
const department_1 = require("../controllers/department");
const note_1 = require("../controllers/note");
const project_1 = require("../controllers/project");
const express_1 = __importDefault(require("express"));
const reaction_1 = require("../controllers/reaction");
const auth_2 = require("../controllers/auth");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), authRoutes = express_1.default.Router(), organizationRoutes = express_1.default.Router(), departmentRoutes = express_1.default.Router(), projectRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), reactionRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router();
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
    // Organization Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/organization", organizationRoutes);
    // Organization summary
    organizationRoutes.get("/summary", organization_1.getAllSummary);
    // Organization names
    organizationRoutes.get("/", organization_1.getOrganizations);
    // Organization details route
    organizationRoutes.get("/:id", auth_1.authenticateJWT, organization_1.getOrganizationDetails);
    // Update or Create Organization
    organizationRoutes.post("/", organization_1.createOrganization);
    // Organization delete route
    organizationRoutes.delete("/:id", auth_1.authenticateJWT, organization_1.deleteOrganization);
    // Organization summary
    organizationRoutes.get("/:id/summary", auth_1.authenticateJWT, organization_1.getOrganizationSummary);
    //= ========================
    // Department Routes
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
    // Project Routes
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FRNkI7QUFDN0Isc0RBQXVFO0FBQ3ZFLDhEQU9xQztBQUNyQyxvREFLZ0M7QUFDaEMsZ0RBSzhCO0FBQzlCLDBEQUltQztBQUNuQyw4Q0FLNkI7QUFDN0Isb0RBSWdDO0FBQ2hDLHNEQUErQztBQUUvQyxzREFBaUU7QUFDakUsOENBQW1EO0FBRW5ELG1CQUF3QixHQUFnQjtJQUN0Qyw0QkFBNEI7SUFDNUIsTUFBTSxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLGtCQUFrQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3JDLGdCQUFnQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ25DLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDOUIsYUFBYSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDakMsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFcEMsNEJBQTRCO0lBQzVCLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFFNUIsc0RBQXNEO0lBQ3RELFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLFFBQVE7SUFDUixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFLLENBQUMsQ0FBQztJQUVqQyxnQkFBZ0I7SUFDaEIsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBWSxDQUFDLENBQUM7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