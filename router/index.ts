import { createFeedback, getFeedbacks } from "../controllers/feedback";
import { createOrganization, deleteOrganization, getOrganizationDetails, login } from "../controllers/organization";
import { createSection, deleteSection, getSectionsByBoardId, updateSection } from "../controllers/section";
import { deleteBoard, getBoardDetails, updateBoard } from "../controllers/board";
import { deleteDepartment, getDepartmentDetails, updateDepartment } from "../controllers/department";
import { deleteNote, getNotesBySectionId, updateNote } from "../controllers/note";
import { deleteProject, getProjectDetails, updateProject } from "../controllers/project";
import express, { Application } from 'express';

import { createOrUpdateReaction } from "../controllers/reaction";

export default function (app: Application) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    organizationRoutes = express.Router(),
    loginRoutes = express.Router(),
    departmentRoutes = express.Router(),
    projectRoutes = express.Router(),
    boardRoutes = express.Router(),
    sectionRoutes = express.Router(),
    noteRoutes = express.Router(),
    reactionRoutes = express.Router(),
    feedbackRoutes = express.Router();

  //= ========================
  // Login Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/login', loginRoutes);

  // Login
  loginRoutes.post('/', login);

  //= ========================
  // Organization Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/organization', organizationRoutes);

  // Organization details route
  organizationRoutes.get('/:id', getOrganizationDetails);

  // Update or Create Organization
  organizationRoutes.post('/', createOrganization);

  // Organization delete route
  organizationRoutes.delete('/:id', deleteOrganization);

  //= ========================
  // Department Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/project', projectRoutes);

  // Project details route
  projectRoutes.get('/:id', getProjectDetails);

  // Create or Update Project
  projectRoutes.put('/', updateProject);

  // Project delete route
  projectRoutes.delete('/:id', deleteProject);

  //= ========================
  // Project Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/department', departmentRoutes);

  // Department details route
  departmentRoutes.get('/:id', getDepartmentDetails);

  // Create or Update Department
  departmentRoutes.put('/', updateDepartment);

  // Department delete route
  departmentRoutes.delete('/:id', deleteDepartment);

  //= ========================
  // Board Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/board', boardRoutes);

  // Board details route
  boardRoutes.get('/:id', getBoardDetails);

  // Update or Create board
  boardRoutes.put('/', updateBoard);

  // Board delete route
  boardRoutes.delete('/:id', deleteBoard);

  //= ========================
  // Section Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/section', sectionRoutes);

  // Section details route
  sectionRoutes.get('/:boardId', getSectionsByBoardId);

  // Section creation route
  sectionRoutes.post('/', createSection);

  // Update or Create Section
  sectionRoutes.put('/', updateSection);

  // Section delete route
  sectionRoutes.delete('/:id', deleteSection);

  //= ========================
  // Note Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/note', noteRoutes);

  // Note details route
  noteRoutes.get('/:sectionId', getNotesBySectionId);

  // Note or Create board
  noteRoutes.put('/', updateNote);

  // Note delete route
  noteRoutes.delete('/:id', deleteNote);

  //= ========================
  // Like Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/react', reactionRoutes);

  // Like creation route
  reactionRoutes.put('/', createOrUpdateReaction);

  //= ========================
  // Feedback Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/feedback', feedbackRoutes);

  // Feedback creation route
  feedbackRoutes.post('/', createFeedback);

  // Get Feedbacks
  feedbackRoutes.get('/', getFeedbacks);

  // Set url for API group routes
  app.use('/', apiRoutes);

};
