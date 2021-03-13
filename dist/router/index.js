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
    //= ========================
    // Organization Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use("/organization", organizationRoutes);
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
    noteRoutes.put("/", auth_1.authenticateJWT, note_1.updateNote);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FLNkI7QUFDN0Isc0RBQXVFO0FBQ3ZFLDhEQUtxQztBQUNyQyxvREFLZ0M7QUFDaEMsZ0RBSzhCO0FBQzlCLDBEQUltQztBQUNuQyw4Q0FLNkI7QUFDN0Isb0RBSWdDO0FBQ2hDLHNEQUErQztBQUUvQyxzREFBaUU7QUFDakUsOENBQW1EO0FBRW5ELG1CQUF3QixHQUFnQjtJQUN0Qyw0QkFBNEI7SUFDNUIsTUFBTSxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLGtCQUFrQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3JDLGdCQUFnQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ25DLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDOUIsYUFBYSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDakMsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFcEMsNEJBQTRCO0lBQzVCLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFFNUIsc0RBQXNEO0lBQ3RELFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLFFBQVE7SUFDUixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFLLENBQUMsQ0FBQztJQUVqQyxnQkFBZ0I7SUFDaEIsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBWSxDQUFDLENBQUM7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