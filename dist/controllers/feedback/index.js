"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = exports.getFeedbacks = void 0;
const feedback_1 = __importDefault(require("../../models/feedback"));
async function getFeedbacks(req, res, next) {
    const query = req.query.like ? { like: req.query.like } : {};
    const feedbacks = await feedback_1.default.find(query);
    if (!feedbacks) {
        res.status(500).json({
            message: "Internal server error, Unable to get customer feedbacks",
        });
        return next(feedbacks);
    }
    return res.status(200).send(feedbacks);
}
exports.getFeedbacks = getFeedbacks;
async function createFeedback(req, res, next) {
    const feedback = new feedback_1.default({
        title: req.body.title,
        description: req.body.description,
        like: req.body.like,
    });
    const feedbackCreated = await feedback.save();
    if (!feedbackCreated) {
        res.status(500).send(feedbackCreated);
        return next(feedbackCreated);
    }
    return res.status(200).send(feedbackCreated);
}
exports.createFeedback = createFeedback;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9mZWVkYmFjay9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFFdEMsS0FBSyxVQUFVLFlBQVksQ0FDaEMsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdELE1BQU0sU0FBUyxHQUFHLE1BQU0sa0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLE9BQU8sRUFBRSx5REFBeUQ7U0FDbkUsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFkRCxvQ0FjQztBQUVNLEtBQUssVUFBVSxjQUFjLENBQ2xDLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7SUFFbEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDO1FBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUs7UUFDckIsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVztRQUNqQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO0tBQ3BCLENBQUMsQ0FBQztJQUNILE1BQU0sZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzlDLElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDOUI7SUFDRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFoQkQsd0NBZ0JDIn0=