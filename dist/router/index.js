"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feedback_1 = require("../controllers/feedback");
const organization_1 = require("../controllers/organization");
const section_1 = require("../controllers/section");
const board_1 = require("../controllers/board");
const department_1 = require("../controllers/department");
const note_1 = require("../controllers/note");
const project_1 = require("../controllers/project");
const express_1 = __importDefault(require("express"));
const reaction_1 = require("../controllers/reaction");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), organizationRoutes = express_1.default.Router(), loginRoutes = express_1.default.Router(), departmentRoutes = express_1.default.Router(), projectRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), reactionRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router();
    //= ========================
    // Login Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/login', loginRoutes);
    // Login
    loginRoutes.post('/', organization_1.login);
    //= ========================
    // Organization Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/organization', organizationRoutes);
    // Organization details route
    organizationRoutes.get('/:id', organization_1.getOrganizationDetails);
    // Update or Create Organization
    organizationRoutes.post('/', organization_1.createOrganization);
    // Organization delete route
    organizationRoutes.delete('/:id', organization_1.deleteOrganization);
    //= ========================
    // Department Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/project', projectRoutes);
    // Project details route
    projectRoutes.get('/:id', project_1.getProjectDetails);
    // Create or Update Project
    projectRoutes.put('/', project_1.updateProject);
    // Project delete route
    projectRoutes.delete('/:id', project_1.deleteProject);
    //= ========================
    // Project Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/department', departmentRoutes);
    // Department details route
    departmentRoutes.get('/:id', department_1.getDepartmentDetails);
    // Create or Update Department
    departmentRoutes.put('/', department_1.updateDepartment);
    // Department delete route
    departmentRoutes.delete('/:id', department_1.deleteDepartment);
    //= ========================
    // Board Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/board', boardRoutes);
    // Board details route
    boardRoutes.get('/:id', board_1.getBoardDetails);
    // Update or Create board
    boardRoutes.put('/', board_1.updateBoard);
    // Board delete route
    boardRoutes.delete('/:id', board_1.deleteBoard);
    //= ========================
    // Section Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/section', sectionRoutes);
    // Section details route
    sectionRoutes.get('/:boardId', section_1.getSectionsByBoardId);
    // Section creation route
    sectionRoutes.post('/', section_1.createSection);
    // Update or Create Section
    sectionRoutes.put('/', section_1.updateSection);
    // Section delete route
    sectionRoutes.delete('/:id', section_1.deleteSection);
    //= ========================
    // Note Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/note', noteRoutes);
    // Note details route
    noteRoutes.get('/:sectionId', note_1.getNotesBySectionId);
    // Note or Create board
    noteRoutes.put('/', note_1.updateNote);
    // Note delete route
    noteRoutes.delete('/:id', note_1.deleteNote);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBdUU7QUFDdkUsOERBQW9IO0FBQ3BILG9EQUEyRztBQUMzRyxnREFBaUY7QUFDakYsMERBQXFHO0FBQ3JHLDhDQUFrRjtBQUNsRixvREFBeUY7QUFDekYsc0RBQStDO0FBRS9DLHNEQUFpRTtBQUVqRSxtQkFBeUIsR0FBZ0I7SUFDdkMsNEJBQTRCO0lBQzVCLE1BQU0sU0FBUyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLGtCQUFrQixHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ3JDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM5QixnQkFBZ0IsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNuQyxhQUFhLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsV0FBVyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzlCLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNoQyxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDN0IsY0FBYyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2pDLGNBQWMsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRXBDLDRCQUE0QjtJQUM1QixlQUFlO0lBQ2YsNEJBQTRCO0lBRTVCLHNEQUFzRDtJQUN0RCxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVyQyxRQUFRO0lBQ1IsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsb0JBQUssQ0FBQyxDQUFDO0lBRTdCLDRCQUE0QjtJQUM1QixzQkFBc0I7SUFDdEIsNEJBQTRCO0lBRTVCLHNEQUFzRDtJQUN0RCxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxrQkFBa0Is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