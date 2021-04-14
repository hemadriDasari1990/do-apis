"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecurityQuestions = exports.createSecurityQuestion = void 0;
const securityQuestion_1 = __importDefault(require("../../models/securityQuestion"));
// import mongoose from "mongoose";
async function createSecurityQuestion(req, res) {
    try {
        if (!req.body) {
            return;
        }
        const securityQuestion = new securityQuestion_1.default(req.body);
        const saved = await securityQuestion.save();
        return res.status(200).send(saved);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.createSecurityQuestion = createSecurityQuestion;
async function getSecurityQuestions(req, res) {
    try {
        if (!req.body) {
            return;
        }
        const securityQuestions = await securityQuestion_1.default.find({});
        return res.status(200).send(securityQuestions);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getSecurityQuestions = getSecurityQuestions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN1cml0eVF1ZXN0aW9uIGNvcHkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEscUZBQTZEO0FBRTdELG1DQUFtQztBQUU1QixLQUFLLFVBQVUsc0JBQXNCLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDdEUsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQ2IsT0FBTztTQUNSO1FBQ0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDcEM7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFYRCx3REFXQztBQUVNLEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxHQUFZLEVBQUUsR0FBYTtJQUNwRSxJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDYixPQUFPO1NBQ1I7UUFDRCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sMEJBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNoRDtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEO0FBQ0gsQ0FBQztBQVZELG9EQVVDIn0=