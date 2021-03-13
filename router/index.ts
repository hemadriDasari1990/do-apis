import {
  authenticateJWT,
  login,
  resendToken,
  verifyAccount,
} from "../controllers/auth";
import { createFeedback, getFeedbacks } from "../controllers/feedback";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationDetails,
  getOrganizationSummary,
} from "../controllers/organization";
import {
  createSection,
  deleteSection,
  getSectionsByBoardId,
  updateSection,
} from "../controllers/section";
import {
  deleteBoard,
  getBoardDetails,
  startOrCompleteBoard,
  updateBoard,
} from "../controllers/board";
import {
  deleteDepartment,
  getDepartmentDetails,
  updateDepartment,
} from "../controllers/department";
import {
  deleteNote,
  getNotesBySectionId,
  markReadNote,
  updateNote,
} from "../controllers/note";
import {
  deleteProject,
  getProjectDetails,
  updateProject,
} from "../controllers/project";
import express, { Application } from "express";

import { createOrUpdateReaction } from "../controllers/reaction";
import { refreshToken } from "../controllers/auth";

export default function(app: Application) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    organizationRoutes = express.Router(),
    departmentRoutes = express.Router(),
    projectRoutes = express.Router(),
    boardRoutes = express.Router(),
    sectionRoutes = express.Router(),
    noteRoutes = express.Router(),
    reactionRoutes = express.Router(),
    feedbackRoutes = express.Router();

  //= ========================
  // Authentication Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/auth", authRoutes);

  // Login
  authRoutes.post("/login", login);

  // refresh token
  authRoutes.post("/refresh-token", refreshToken);

  // verify account
  authRoutes.post("/verify-token", verifyAccount);

  // resend verification token
  authRoutes.post("/resend-token", resendToken);

  //= ========================
  // Organization Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/organization", organizationRoutes);

  // Organization details route
  organizationRoutes.get("/:id", authenticateJWT, getOrganizationDetails);

  // Update or Create Organization
  organizationRoutes.post("/", createOrganization);

  // Organization delete route
  organizationRoutes.delete("/:id", authenticateJWT, deleteOrganization);

  // Organization summary
  organizationRoutes.get(
    "/:id/summary",
    authenticateJWT,
    getOrganizationSummary
  );

  //= ========================
  // Department Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/project", projectRoutes);

  // Project details route
  projectRoutes.get("/:id", authenticateJWT, getProjectDetails);

  // Create or Update Project
  projectRoutes.put("/", authenticateJWT, updateProject);

  // Project delete route
  projectRoutes.delete("/:id", authenticateJWT, deleteProject);

  //= ========================
  // Project Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/department", departmentRoutes);

  // Department details route
  departmentRoutes.get("/:id", authenticateJWT, getDepartmentDetails);

  // Create or Update Department
  departmentRoutes.put("/", authenticateJWT, updateDepartment);

  // Department delete route
  departmentRoutes.delete("/:id", authenticateJWT, deleteDepartment);

  //= ========================
  // Board Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/board", boardRoutes);

  // Board details route
  boardRoutes.get("/:id", getBoardDetails);

  // Update or Create board
  boardRoutes.put("/", authenticateJWT, updateBoard);

  // Board delete route
  boardRoutes.delete("/:id", authenticateJWT, deleteBoard);

  // Start or complete the board
  boardRoutes.put("/session/:action", authenticateJWT, startOrCompleteBoard);

  //= ========================
  // Section Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/section", sectionRoutes);

  // Section details route
  sectionRoutes.get("/:boardId", getSectionsByBoardId);

  // Section creation route
  sectionRoutes.post("/", authenticateJWT, createSection);

  // Update or Create Section
  sectionRoutes.put("/", authenticateJWT, updateSection);

  // Section delete route
  sectionRoutes.delete("/:id", authenticateJWT, deleteSection);

  //= ========================
  // Note Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/note", noteRoutes);

  // Note details route
  noteRoutes.get("/:sectionId", getNotesBySectionId);

  // Note or Create board
  noteRoutes.put("/", authenticateJWT, updateNote);

  // Mark read
  noteRoutes.put("/:id/mark-read", authenticateJWT, markReadNote);

  // Note delete route
  noteRoutes.delete("/:id", authenticateJWT, deleteNote);

  //= ========================
  // Like Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/react", reactionRoutes);

  // Like creation route
  reactionRoutes.put("/", createOrUpdateReaction);

  //= ========================
  // Feedback Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/feedback", feedbackRoutes);

  // Feedback creation route
  feedbackRoutes.post("/", createFeedback);

  // Get Feedbacks
  feedbackRoutes.get("/", getFeedbacks);

  // Set url for API group routes
  app.use("/", apiRoutes);
}
