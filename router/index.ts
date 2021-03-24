import {
  addOrRemoveMemberFromTeam,
  deleteTeam,
  getTeams,
  updateTeam,
  sendInvitationToTeams,
} from "../controllers/team";
import {
  authenticateJWT,
  forgotPassword,
  login,
  resendToken,
  resetPassword,
  validateForgotPassword,
  verifyAccount,
} from "../controllers/auth";
import { createFeedback, getFeedbacks } from "../controllers/feedback";
import { getSectionsByBoardId } from "../controllers/section";
import {
  createUser,
  deleteUser,
  getAllSummary,
  getUserDetails,
  getUserSummary,
  getUsers,
} from "../controllers/user";
import {
  deleteBoard,
  getBoardDetails,
  updateBoard,
} from "../controllers/board";
import {
  deleteDepartment,
  getDepartmentDetails,
  updateDepartment,
} from "../controllers/department";
import {
  deleteMember,
  getMemberDetails,
  getMembersByUser,
  updateMember,
} from "../controllers/member";
import { getNotesBySectionId } from "../controllers/note";
import {
  deleteProject,
  getProjectDetails,
  updateProject,
} from "../controllers/project";
import express, { Application } from "express";

import { refreshToken, logout } from "../controllers/auth";

export default function(app: Application) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    departmentRoutes = express.Router(),
    projectRoutes = express.Router(),
    boardRoutes = express.Router(),
    sectionRoutes = express.Router(),
    noteRoutes = express.Router(),
    teamRoutes = express.Router(),
    memberRoutes = express.Router(),
    feedbackRoutes = express.Router();

  //= ========================
  // Authentication Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/auth", authRoutes);

  // Login
  authRoutes.post("/login", login);

  // Logout
  authRoutes.post("/logout", logout);

  // refresh token
  authRoutes.post("/refresh-token", refreshToken);

  // verify account
  authRoutes.post("/verify-token", verifyAccount);

  // resend verification token
  authRoutes.post("/resend-token", resendToken);

  // forgot password
  authRoutes.post("/forgot-password", forgotPassword);

  // validate forgot password token
  authRoutes.post("/validate-forgot-password", validateForgotPassword);

  // reset password
  authRoutes.post("/reset-password", resetPassword);

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/user", userRoutes);

  // User summary
  userRoutes.get("/summary", getAllSummary);

  // User names
  userRoutes.get("/", getUsers);

  // User details route
  userRoutes.get("/:id", authenticateJWT, getUserDetails);

  // Update or Create User
  userRoutes.post("/", createUser);

  // User delete route
  userRoutes.delete("/:id", authenticateJWT, deleteUser);

  // User summary
  userRoutes.get("/:id/summary", authenticateJWT, getUserSummary);

  //= ========================
  // Team Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/team", teamRoutes);

  // Team details route
  teamRoutes.get("/", authenticateJWT, getTeams);

  // Create or Update Team
  teamRoutes.put("/", authenticateJWT, updateTeam);

  // Create or Update Team
  teamRoutes.put("/:id/member", authenticateJWT, addOrRemoveMemberFromTeam);

  // Send invitations to team members
  teamRoutes.post("/invitation", authenticateJWT, sendInvitationToTeams);

  // Team delete route
  teamRoutes.delete("/:id", authenticateJWT, deleteTeam);

  //= ========================
  // Member Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/member", memberRoutes);

  // Get all members
  memberRoutes.get("/", authenticateJWT, getMembersByUser);

  // Member details route
  memberRoutes.get("/:id", authenticateJWT, getMemberDetails);

  // Create or Update Member
  memberRoutes.put("/", authenticateJWT, updateMember);

  // Member delete route
  memberRoutes.delete("/:id", authenticateJWT, deleteMember);

  //= ========================
  // Department Routes
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
  // Project Routes
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

  //= ========================
  // Section Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/section", sectionRoutes);

  // Section details route
  sectionRoutes.get("/:boardId", getSectionsByBoardId);

  //= ========================
  // Note Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/note", noteRoutes);

  // Note details route
  noteRoutes.get("/:sectionId", getNotesBySectionId);

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
