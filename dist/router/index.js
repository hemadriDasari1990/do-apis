"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("../controllers/board");
const feedback_1 = require("../controllers/feedback");
const note_1 = require("../controllers/note");
const section_1 = require("../controllers/section");
const express_1 = __importDefault(require("express"));
const reaction_1 = require("../controllers/reaction");
function default_1(app) {
    // Initializing route groups
    const apiRoutes = express_1.default.Router(), boardRoutes = express_1.default.Router(), sectionRoutes = express_1.default.Router(), noteRoutes = express_1.default.Router(), reactionRoutes = express_1.default.Router(), feedbackRoutes = express_1.default.Router();
    //= ========================
    // Board Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/board', boardRoutes);
    // Board details route
    boardRoutes.get('/', board_1.getAllBoards);
    // Board details route
    boardRoutes.get('/:id', board_1.getBoardDetails);
    // Board creation route
    boardRoutes.post('/', board_1.createBoard);
    // Update or Create board
    boardRoutes.put('/', board_1.updateBoard);
    // Board delete route
    boardRoutes.delete('/:id', board_1.deleteBoard);
    //= ========================
    // Section Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/section', sectionRoutes);
    // Sections route
    sectionRoutes.get('/', section_1.getAllSections);
    // Section details route
    sectionRoutes.get('/:boardId', section_1.getSectionsByBoardId);
    // Section creation route
    sectionRoutes.post('/', section_1.createSection);
    // Update or Create Section
    sectionRoutes.put('/:id', section_1.updateSection);
    // Section delete route
    sectionRoutes.delete('/:id', section_1.deleteSection);
    //= ========================
    // Note Routes
    //= ========================
    // Set user routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/note', noteRoutes);
    // Notes route
    noteRoutes.get('/', note_1.getAllNotes);
    // Note details route
    noteRoutes.get('/:sectionId', note_1.getNotesBySectionId);
    // Note creation route
    noteRoutes.post('/', note_1.createNote);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yb3V0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBNEc7QUFDNUcsc0RBQXVFO0FBQ3ZFLDhDQUEyRztBQUMzRyxvREFBMkg7QUFDM0gsc0RBQStDO0FBRS9DLHNEQUFpRTtBQUVqRSxtQkFBeUIsR0FBZ0I7SUFDdkMsNEJBQTRCO0lBQzVCLE1BQU0sU0FBUyxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQ2hDLFdBQVcsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUM5QixhQUFhLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLEVBQzdCLGNBQWMsR0FBRyxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUNqQyxjQUFjLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVwQyw0QkFBNEI7SUFDNUIsZUFBZTtJQUNmLDRCQUE0QjtJQUU1QixzREFBc0Q7SUFDdEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFckMsc0JBQXNCO0lBQ3RCLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLG9CQUFZLENBQUMsQ0FBQztJQUVuQyxzQkFBc0I7SUFDdEIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsdUJBQWUsQ0FBQyxDQUFDO0lBRXpDLHVCQUF1QjtJQUN2QixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxtQkFBVyxDQUFDLENBQUM7SUFFbkMseUJBQXlCO0lBQ3pCLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLG1CQUFXLENBQUMsQ0FBQztJQUVsQyxxQkFBcUI7SUFDckIsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsbUJBQVcsQ0FBQyxDQUFDO0lBRXhDLDRCQUE0QjtJQUM1QixpQkFBaUI7SUFDakIsNEJBQTRCO0lBRTVCLHNEQUFzRDtJQUN0RCxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUV6QyxpQkFBaUI7SUFDakIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsd0JBQWMsQ0FBQyxDQUFDO0lBRXZDLHdCQUF3QjtJQUN4QixhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSw4QkFBb0IsQ0FBQyxDQUFDO0lBRXJELHlCQUF5QjtJQUN6QixhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSx1QkFBYSxDQUFDLENBQUM7SUFFdkMsMkJBQTJCO0lBQzNCLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHVCQUFhLENBQUMsQ0FBQztJQUV6Qyx1QkFBdUI7SUFDdkIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsdUJBQWEsQ0FBQyxDQUFDO0lBRTVDLDRCQUE0QjtJQUM1QixjQUFjO0lBQ2QsNEJBQTRCO0lBRTVCLHNEQUFzRDtJQUN0RCxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUVuQyxjQUFjO0lBQ2QsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsa0JBQVcsQ0FBQyxDQUFDO0lBRWpDLHFCQUFxQjtJQUNyQixVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSwwQkFBbUIsQ0FBQyxDQUFDO0lBRW5ELHNCQUFzQjtJQUN0QixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxpQkFBVSxDQUFDLENBQUM7SUFFakMsdUJBQXVCO0lBQ3ZCLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGlCQUFVLENBQUMsQ0FBQztJQUVoQyxvQkFBb0I7SUFDcEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsaUJBQVUsQ0FBQyxDQUFDO0lBRXRDLDRCQUE0QjtJQUM1QixjQUFjO0lBQ2QsNEJBQTRCO0lBRTVCLHNEQUFzRDtJQUN0RCxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUV4QyxzQkFBc0I7SUFDdEIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsaUNBQXNCLENBQUMsQ0FBQztJQUVoRCw0QkFBNEI7SUFDNUIsa0JBQWtCO0lBQ2xCLDRCQUE0QjtJQUU1QixzREFBc0Q7SUFDdEQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFM0MsMEJBQTBCO0lBQzFCLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLHlCQUFjLENBQUMsQ0FBQztJQUV6QyxnQkFBZ0I7SUFDaEIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsdUJBQVksQ0FBQyxDQUFDO0lBRXRDLCtCQUErQjtJQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUxQixDQUFDO0FBckdELDRCQXFHQztBQUFBLENBQUMifQ==