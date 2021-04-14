"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySecurityQuestionAnswer = exports.createSecurityQuestionAnswer = void 0;
const constants_1 = require("../../util/constants");
const securityQuestionAnswer_1 = __importDefault(require("../../models/securityQuestionAnswer"));
const user_1 = __importDefault(require("../../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("../../util");
// import mongoose from "mongoose";
async function createSecurityQuestionAnswer(req, res) {
    try {
        if (!req.body.questionId || !req.body.value || !req.body.password) {
            return;
        }
        const user = await util_1.getUser(req.headers.authorization);
        const userFromDb = await user_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        if (!userFromDb) {
            return res.status(500).json({
                errorId: constants_1.USER_NOT_FOUND,
                errorMessage: "User not found",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(req.body.password, userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb.password);
        if (!isPasswordValid) {
            return res.status(422).json({
                errorId: constants_1.INCORRECT_PASSWORD,
                errorMessage: "Incorrect Password",
            });
        }
        const query = {
            $and: [
                { userId: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb._id },
                { questionId: req.body.questionId },
            ],
        }, update = {
            $set: {
                userId: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb._id,
                questionId: req.body.questionId,
                value: req.body.value,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await securityQuestionAnswer_1.default.findOneAndUpdate(query, update, options);
        return res
            .status(200)
            .send(Object.assign(Object.assign({}, updated), { message: "Answer saved Successfully" }));
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.createSecurityQuestionAnswer = createSecurityQuestionAnswer;
async function verifySecurityQuestionAnswer(req, res) {
    try {
        if (!req.body.questionId || !req.body.value) {
            return;
        }
        const user = await util_1.getUser(req.headers.authorization);
        const userFromDb = await user_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        if (!userFromDb) {
            return res.status(500).json({
                errorId: constants_1.USER_NOT_FOUND,
                errorMessage: "User not found",
            });
        }
        const answer = await securityQuestionAnswer_1.default.findOne({
            $and: [
                {
                    userId: userFromDb === null || userFromDb === void 0 ? void 0 : userFromDb._id,
                },
                {
                    questionId: req.body.questionId,
                },
                {
                    value: req.body.value,
                },
            ],
        });
        if (!answer) {
            return res.status(500).json({
                errorId: constants_1.ANSWER_NOT_MATCHING,
                errorMessage: "Answer is incorrect",
            });
        }
        await securityQuestionAnswer_1.default.findByIdAndUpdate(user._id, {
            answered: true,
        });
        return res
            .status(200)
            .send({ verified: true, message: "Answer verified Successfully" });
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.verifySecurityQuestionAnswer = verifySecurityQuestionAnswer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9zZWN1cml0eVF1ZXN0aW9uQW5zd2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUk4QjtBQUc5QixpR0FBeUU7QUFDekUsNkRBQXFDO0FBQ3JDLG9EQUE0QjtBQUM1QixxQ0FBcUM7QUFFckMsbUNBQW1DO0FBRTVCLEtBQUssVUFBVSw0QkFBNEIsQ0FDaEQsR0FBWSxFQUNaLEdBQWE7SUFFYixJQUFJO1FBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqRSxPQUFPO1NBQ1I7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGNBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQXVCLENBQUMsQ0FBQztRQUNoRSxNQUFNLFVBQVUsR0FBUSxNQUFNLGNBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsMEJBQWM7Z0JBQ3ZCLFlBQVksRUFBRSxnQkFBZ0I7YUFDL0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLGVBQWUsR0FBRyxNQUFNLGdCQUFNLENBQUMsT0FBTyxDQUMxQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDakIsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFFBQVEsQ0FDckIsQ0FBQztRQUNGLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdB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