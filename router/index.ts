import { createBoard, deleteBoard, getAllBoards, getBoardDetails, updateBoard } from "../controllers/board";
import { createFeedback, getFeedbacks } from "../controllers/feedback";
import { createNote, deleteNote, getAllNotes, getNotesBySectionId, updateNote } from "../controllers/note";
import { createSection, deleteSection, getAllSections, getSectionsByBoardId, updateSection } from "../controllers/section";
import express, { Application } from 'express';

import { createOrUpdateReaction } from "../controllers/reaction";

export default function (app: Application) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    boardRoutes = express.Router(),
    sectionRoutes = express.Router(),
    noteRoutes = express.Router(),
    reactionRoutes = express.Router(),
    feedbackRoutes = express.Router();

  //= ========================
  // Board Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/board', boardRoutes);

  // Board details route
  boardRoutes.get('/', getAllBoards);

  // Board details route
  boardRoutes.get('/:id', getBoardDetails);

  // Board creation route
  boardRoutes.post('/', createBoard);

  // Update or Create board
  boardRoutes.put('/', updateBoard);

  // Board delete route
  boardRoutes.delete('/:id', deleteBoard);

  //= ========================
  // Section Routes
  //= ========================

  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/section', sectionRoutes);

  // Sections route
  sectionRoutes.get('/', getAllSections);

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

  // Notes route
  noteRoutes.get('/', getAllNotes);

  // Note details route
  noteRoutes.get('/:sectionId', getNotesBySectionId);

  // Note creation route
  noteRoutes.post('/', createNote);

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
