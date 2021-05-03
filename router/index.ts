import {
  addOrRemoveMemberFromTeam,
  deleteTeam,
  getTeamsByUser,
  sendInvitationToTeams,
  updateTeam,
} from "../controllers/team";
import {
  addOrRemoveMemberFromTeamValidator,
  deleteTeamValidator,
  getTeamsByUserValidator,
  sendInvitationToTeamsValidator,
  updateTeamValidator,
} from "../controllers/team/validator";
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
  updateAvatar,
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
  deleteBoardValidator,
  downloadBoardReportValidator,
  getBoardDetailsValidator,
  getBoardsByUserValidator,
  updateBoardValidator,
} from "../controllers/board/validator";
import {
  deleteMember,
  getMemberDetails,
  getMembersByUser,
  updateMember,
} from "../controllers/member";
import {
  deleteMemberValidator,
  getMemberDetailsValidator,
  getMembersByUserValidator,
  updateMemberValidator,
} from "../controllers/member/validator";
import {
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project";
import {
  deleteProjectValidator,
  getProjectsValidator,
  updateProjectValidator,
} from "../controllers/project/validator";
import {
  deleteUserValidator,
  signupValidator,
  updateAvatarValidator,
  updateEmailValidator,
  updateNameValidator,
  updatePasswordValidator,
} from "../controllers/user/validator";
import express, { Application } from "express";
import {
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  resendTokenValidator,
  resetPasswordValidator,
  validateForgotPasswordValidator,
  verifyAccountValidator,
} from "../controllers/auth/validator";
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
import { getJoinedMembers } from "../controllers/join";
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
    joinRoutes = express.Router(),
    activityRoutes = express.Router();

  //= ========================
  // Authentication Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/auth", authRoutes);

  // Login
  authRoutes.post("/login", loginValidator, login);

  // Logout
  authRoutes.post("/logout", logout);

  // refresh token
  authRoutes.post("/refresh-token", refreshTokenValidator, refreshToken);

  // verify account
  authRoutes.post("/verify-token", verifyAccountValidator, verifyAccount);

  // resend verification token
  authRoutes.post("/resend-token", resendTokenValidator, resendToken);

  // forgot password
  authRoutes.post("/forgot-password", forgotPasswordValidator, forgotPassword);

  // validate forgot password token
  authRoutes.post(
    "/validate-forgot-password",
    validateForgotPasswordValidator,
    validateForgotPassword
  );

  // reset password
  authRoutes.post("/reset-password", resetPasswordValidator, resetPassword);

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
  userRoutes.put("/email", authenticateJWT, updateEmailValidator, updateEmail);

  // Update user route
  userRoutes.put("/name", authenticateJWT, updateNameValidator, updateName);

  // Update password route
  userRoutes.put(
    "/update-password",
    authenticateJWT,
    updatePasswordValidator,
    updatePassword
  );

  // Get Boards by user
  userRoutes.get(
    "/:id/boards",
    authenticateJWT,
    getBoardsByUserValidator,
    getBoardsByUser
  );

  // Update or Create User
  userRoutes.post("/", signupValidator, createUser);

  // User delete route
  userRoutes.delete("/:id", authenticateJWT, deleteUserValidator, deleteUser);

  // User summary
  userRoutes.get("/:id/summary", authenticateJWT, getUserSummary);

  // Update user Avatar
  userRoutes.put(
    "/update-avatar",
    authenticateJWT,
    updateAvatarValidator,
    updateAvatar
  );

  //= ========================
  // Team Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/team", teamRoutes);

  // Team details route
  teamRoutes.get("/", authenticateJWT, getTeamsByUserValidator, getTeamsByUser);

  // Create or Update Team
  teamRoutes.put("/", authenticateJWT, updateTeamValidator, updateTeam);

  // Create or Update Team
  teamRoutes.put(
    "/:id/member",
    authenticateJWT,
    addOrRemoveMemberFromTeamValidator,
    addOrRemoveMemberFromTeam
  );

  // Send invitations to team members
  teamRoutes.post(
    "/invitation",
    authenticateJWT,
    sendInvitationToTeamsValidator,
    sendInvitationToTeams
  );

  // Team delete route
  teamRoutes.delete("/:id", authenticateJWT, deleteTeamValidator, deleteTeam);

  //= ========================
  // Member Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/member", memberRoutes);

  // Get all members
  memberRoutes.get(
    "/",
    authenticateJWT,
    getMembersByUserValidator,
    getMembersByUser
  );

  // Member details route
  memberRoutes.get(
    "/:id",
    authenticateJWT,
    getMemberDetailsValidator,
    getMemberDetails
  );

  // Create or Update Member
  memberRoutes.put("/", authenticateJWT, updateMemberValidator, updateMember);

  // Member delete route
  memberRoutes.delete(
    "/:id",
    authenticateJWT,
    deleteMemberValidator,
    deleteMember
  );

  //= ========================
  // Project Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/project", projectRoutes);

  // Project details route
  projectRoutes.get("/", authenticateJWT, getProjectsValidator, getProjects);

  // Create or Update Project
  projectRoutes.put(
    "/",
    authenticateJWT,
    updateProjectValidator,
    updateProject
  );

  // Project delete route
  projectRoutes.delete(
    "/:id",
    authenticateJWT,
    deleteProjectValidator,
    deleteProject
  );

  //= ========================
  // Board Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/board", boardRoutes);

  // Get Boards route
  boardRoutes.get("/", getBoards);

  // Board details route
  boardRoutes.get("/:id", getBoardDetailsValidator, getBoardDetails);

  // Update or Create board
  boardRoutes.put("/", authenticateJWT, updateBoardValidator, updateBoard);

  // Board delete route
  boardRoutes.delete(
    "/:id",
    authenticateJWT,
    deleteBoardValidator,
    deleteBoard
  );

  // download board report
  boardRoutes.get(
    "/:id/download-report",
    authenticateJWT,
    downloadBoardReportValidator,
    downloadBoardReport
  );

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
  // Join Routes
  //= ========================

  // Set invite routes as subgroup/middleware to apiRoutes
  apiRoutes.use("/join", joinRoutes);

  // Get Joined members
  joinRoutes.get("/", authenticateJWT, getJoinedMembers);

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
