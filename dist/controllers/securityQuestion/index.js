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
        console.log(req);
        const securityQuestions = await securityQuestion_1.default.find({});
        return res.status(200).send(securityQuestions);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getSecurityQuestions = getSecurityQuestions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN1cml0eVF1ZXN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHFGQUE2RDtBQUU3RCxtQ0FBbUM7QUFFNUIsS0FBSyxVQUFVLHNCQUFzQixDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ3RFLElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtZQUNiLE9BQU87U0FDUjtRQUNELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSwwQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsTUFBTSxLQUFLLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM1QyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BDO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBWEQsd0RBV0M7QUFFTSxLQUFLLFVBQVUsb0JBQW9CLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDcEUsSUFBSTtRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFakIsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLDBCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDaEQ7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUFURCxvREFTQyJ9