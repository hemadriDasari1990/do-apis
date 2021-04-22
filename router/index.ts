import {
  addOrRemoveMemberFromTeam,
  deleteTeam,
  getTeamsByUser,
  sendInvitationToTeams,
  updateTeam,
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
import {
  createSecurityQuestion,
  getSecurityQuestions,
} from "../controllers/securityQuestion";
import {
  createSecurityQuestionAnswer,
  verifySecurityQuestionAnswer,
} from "../controllers/securityQuestionAnswer";
import {
  createUser,
  deleteUser,
  getAllSummary,
  getBoardsByUser,
  getUserDetails,
  getUserSummary,
  getUsers,
  updateEmail,
  updateName,
  updatePassword,
} from "../controllers/user";
import {
  deleteBoard,
  downloadBoardReport,
  getBoardDetails,
  getBoards,
  updateBoard,
} from "../controllers/board";
import {
  deleteMember,
  getMemberDetails,
  getMembersByUser,
  updateMember,
} from "../controllers/member";
import {
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project";
import express, { Application } from "express";
import {
  getReactionSummaryByBoard,
  getReactionSummaryByNote,
  getReactionSummaryBySection,
  getReactions,
} from "../controllers/reaction";
import { logout, refreshToken } from "../controllers/auth";

import { getActionByBoardId } from "../controllers/action";
import { getActionItemsByActionId } from "../controllers/actionItem";
import { getActivities } from "../controllers/activity";
import { getInvitedMembers } from "../controllers/invite";
import { getNotesBySectionId } from "../controllers/note";
import { getSectionsByBoardId } from "../controllers/section";

export default function(app: Application) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    projectRoutes = express.Router(),
    boardRoutes = express.Router(),
    sectionRoutes = express.Router(),
    noteRoutes = express.Router(),
    teamRoutes = express.Router(),
    memberRoutes = express.Router(),
    reactionRoutes = express.Router(),
    securityQuestionRoutes = express.Router(),
    actionRoutes = express.Router(),
    actionItemRoutes = express.Router(),
    feedbackRoutes = express.Router(),
    inviteRoutes = express.Router(),
    activityRoutes = express.Router();

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

  // Update user route
  userRoutes.put("/email", authenticateJWT, updateEmail);

  // Update user route
  userRoutes.put("/name", authenticateJWT, updateName);

  // Update password route
  userRoutes.put("/update-password", authenticateJWT, updatePassword);

  // Get Boards by user
  userRoutes.get("/:id/boards", authenticateJWT, getBoardsByUser);

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
  teamRoutes.get("/", authenticateJWT, getTeamsByUser);

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
  // Project Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/project", projectRoutes);

  // Project details route
  projectRoutes.get("/", authenticateJWT, getProjects);

  // Create or Update Project
  projectRoutes.put("/", authenticateJWT, updateProject);

  // Project delete route
  projectRoutes.delete("/:id", authenticateJWT, deleteProject);

  //= ========================
  // Board Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/board", boardRoutes);

  // Get Boards route
  boardRoutes.get("/", getBoards);

  // Board details route
  boardRoutes.get("/:id", getBoardDetails);

  // Update or Create board
  boardRoutes.put("/", authenticateJWT, updateBoard);

  // Board delete route
  boardRoutes.delete("/:id", authenticateJWT, deleteBoard);

  // download board report
  boardRoutes.get("/:id/download-report", authenticateJWT, downloadBoardReport);

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

  // Set note routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/note", noteRoutes);

  // Note details route
  noteRoutes.get("/:sectionId", getNotesBySectionId);

  //= ========================
  // Action Routes
  //= ========================

  // Action routes
  apiRoutes.use("/action", actionRoutes);

  // Action details route
  actionRoutes.get("/:boardId", getActionByBoardId);

  //= ========================
  // Action item Routes
  //= ========================

  // Set action item routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/action-item", actionItemRoutes);

  // Action item details route
  actionItemRoutes.get("/:actionId", getActionItemsByActionId);

  //= ========================
  // Reaction Routes
  //= ========================

  // Set reaction routes as subgroup/middleware to apiRoutes

  apiRoutes.use("/reactions", reactionRoutes);

  // Get reactions summary by board ID
  reactionRoutes.get("/:boardId/summary", getReactionSummaryByBoard);

  // Get reactions summary by section ID
  reactionRoutes.get(
    "/:sectionId/section-summary",
    getReactionSummaryBySection
  );

  // Get reactions summary by note ID
  reactionRoutes.get("/:noteId/note-summary", getReactionSummaryByNote);

  // Get reactions
  reactionRoutes.get("/", getReactions);

  //= ========================
  // Feedback Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/feedback", feedbackRoutes);

  // Feedback creation route
  feedbackRoutes.post("/", createFeedback);

  // Get Feedbacks
  feedbackRoutes.get("/", getFeedbacks);

  //= ========================
  // Activity Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/activity", activityRoutes);

  // Get Activities
  activityRoutes.get("/", getActivities);

  //= ========================
  // Invite Routes
  //= ========================

  // Set invite routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/invite", inviteRoutes);

  // Get Inivted members
  inviteRoutes.get("/", authenticateJWT, getInvitedMembers);

  //= ========================
  // Security Questions Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/security-question", securityQuestionRoutes);

  // Get Security Questions
  securityQuestionRoutes.get("/", authenticateJWT, getSecurityQuestions);

  // Get Security Questions
  securityQuestionRoutes.post("/", authenticateJWT, createSecurityQuestion);

  // create Security Question Answer
  securityQuestionRoutes.post(
    "/answer",
    authenticateJWT,
    createSecurityQuestionAnswer
  );

  // Verify Security Question Answer
  securityQuestionRoutes.post(
    "/verify",
    authenticateJWT,
    verifySecurityQuestionAnswer
  );
  // Set url for API group routes
  app.use("/", apiRoutes);
}
