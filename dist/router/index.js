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
    apiRoutes.use('/auth', authRoutes);
    // Login
    authRoutes.post('/login', auth_1.login);
    // Login
    authRoutes.post('/refresh-token', auth_2.refreshToken);
    //= ========================
    // Organization Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/organization', organizationRoutes);
    // Organization details route
    organizationRoutes.get('/:id', auth_1.authenticateJWT, organization_1.getOrganizationDetails);
    // Update or Create Organization
    organizationRoutes.post('/', organization_1.createOrganization);
    // Organization delete route
    organizationRoutes.delete('/:id', auth_1.authenticateJWT, organization_1.deleteOrganization);
    //= ========================
    // Department Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/project', projectRoutes);
    // Project details route
    projectRoutes.get('/:id', auth_1.authenticateJWT, project_1.getProjectDetails);
    // Create or Update Project
    projectRoutes.put('/', auth_1.authenticateJWT, project_1.updateProject);
    // Project delete route
    projectRoutes.delete('/:id', auth_1.authenticateJWT, project_1.deleteProject);
    //= ========================
    // Project Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/department', departmentRoutes);
    // Department details route
    departmentRoutes.get('/:id', auth_1.authenticateJWT, department_1.getDepartmentDetails);
    // Create or Update Department
    departmentRoutes.put('/', auth_1.authenticateJWT, department_1.updateDepartment);
    // Department delete route
    departmentRoutes.delete('/:id', auth_1.authenticateJWT, department_1.deleteDepartment);
    //= ========================
    // Board Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/board', boardRoutes);
    // Board details route
    boardRoutes.get('/:id', board_1.getBoardDetails);
    // Update or Create board
    boardRoutes.put('/', auth_1.authenticateJWT, board_1.updateBoard);
    // Board delete route
    boardRoutes.delete('/:id', auth_1.authenticateJWT, board_1.deleteBoard);
    //= ========================
    // Section Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/section', sectionRoutes);
    // Section details route
    sectionRoutes.get('/:boardId', section_1.getSectionsByBoardId);
    // Section creation route
    sectionRoutes.post('/', auth_1.authenticateJWT, section_1.createSection);
    // Update or Create Section
    sectionRoutes.put('/', auth_1.authenticateJWT, section_1.updateSection);
    // Section delete route
    sectionRoutes.delete('/:id', auth_1.authenticateJWT, section_1.deleteSection);
    //= ========================
    // Note Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/note', noteRoutes);
    // Note details route
    noteRoutes.get('/:sectionId', note_1.getNotesBySectionId);
    // Note or Create board
    noteRoutes.put('/', auth_1.authenticateJWT, note_1.updateNote);
    // Mark read
    noteRoutes.put('/:id/mark-read', auth_1.authenticateJWT, note_1.markReadNote);
    // Note delete route
    noteRoutes.delete('/:id', auth_1.authenticateJWT, note_1.deleteNote);
    //= ========================
    // Like Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/react', reactionRoutes);
    // Like creation route
    reactionRoutes.put('/', reaction_1.createOrUpdateReaction);
    //= ========================
    // Feedback Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/feedback', feedbackRoutes);
    // Feedback creation route
    feedbackRoutes.post('/', feedback_1.createFeedback);
    // Get Feedbacks
    feedbackRoutes.get('/', feedback_1.getFeedbacks);
    // Set url for API group routes
    app.use('/', apiRoutes);
}
exports.default = default_1;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBNkQ7QUFDN0Qsc0RBQXVFO0FBQ3ZFLDhEQUE2RztBQUM3RyxvREFBMkc7QUFDM0csZ0RBQWlGO0FBQ2pGLDBEQUFxRztBQUNyRyw4Q0FBZ0c7QUFDaEcsb0RBQXlGO0FBQ3pGLHNEQUErQztBQUUvQyxzREFBaUU7QUFDakUsOENBQWtEO0FBRWxELG1CQUF5QixHQUFnQjtJQUN2Qyw0QkFBNEI7SUFDNUIsTUFBTSxTQUFTLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLGtCQUFrQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3JDLGdCQUFnQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ25DLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxXQUFXLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDOUIsYUFBYSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFVBQVUsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM3QixjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDakMsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFHcEMsNEJBQTRCO0lBQzVCLHdCQUF3QjtJQUN4Qiw0QkFBNEI7SUFFNUIsc0RBQXNEO0lBQ3RELFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRW5DLFFBQVE7SUFDUixVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFLLENBQUMsQ0FBQztJQUVqQyxRQUFRO0lBQ1IsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBWSxDQUFDLENBQUM7SUFF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