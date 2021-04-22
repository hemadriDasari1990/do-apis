"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = exports.getFeedbacks = void 0;
const feedback_1 = __importDefault(require("../../models/feedback"));
const util_1 = require("../../util");
const userFilters_1 = require("../../util/userFilters");
async function getFeedbacks(req, res) {
    try {
        const query = req.query.like ? { like: Boolean(req.query.like) } : {};
        const aggregators = [];
        aggregators.push({
            $facet: {
                data: [
                    { $match: query },
                    { $sort: { _id: -1 } },
                    { $limit: parseInt(req.query.limit) },
                    userFilters_1.userLookup,
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ],
                total: [{ $match: query }, { $count: "count" }],
            },
        });
        const feedbacks = await feedback_1.default.aggregate(aggregators);
        return res.status(200).send((feedbacks === null || feedbacks === void 0 ? void 0 : feedbacks.length) ? feedbacks[0] : null);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getFeedbacks = getFeedbacks;
async function createFeedback(req, res, next) {
    var _a, _b, _c;
    try {
        const user = util_1.getUser(req.headers.authorization);
        const feedback = new feedback_1.default({
            title: (_a = req.body) === null || _a === void 0 ? void 0 : _a.title,
            description: (_b = req.body) === null || _b === void 0 ? void 0 : _b.description,
            like: (_c = req.body) === null || _c === void 0 ? void 0 : _c.like,
            userId: user === null || user === void 0 ? void 0 : user._id,
        });
        const feedbackCreated = await feedback.save();
        if (!feedbackCreated) {
            res.status(500).send(feedbackCreated);
            return next(feedbackCreated);
        }
        return res.status(200).send(feedbackCreated);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.createFeedback = createFeedback;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9mZWVkYmFjay9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFDN0MscUNBQXFDO0FBQ3JDLHdEQUFvRDtBQUU3QyxLQUFLLFVBQVUsWUFBWSxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQzVELElBQUk7UUFDRixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ2YsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRTtvQkFDSixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7b0JBQ2pCLEVBQUUsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ3RCLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQWUsQ0FBQyxFQUFFO29CQUMvQyx3QkFBVTtvQkFDVjt3QkFDRSxPQUFPLEVBQUU7NEJBQ1AsSUFBSSxFQUFFLE9BQU87NEJBQ2IsMEJBQTBCLEVBQUUsSUFBSTt5QkFDakM7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDaEQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxNQUFNLGtCQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQSxTQUFTLGFBQVQsU0FBUyx1QkFBVCxTQUFTLENBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RFO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBM0JELG9DQTJCQztBQUVNLEtBQUssVUFBVSxjQUFjLENBQ2xDLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7O0lBRWxCLElBQUk7UUFDRixNQUFNLElBQUksR0FBRyxjQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUF1QixDQUFDLENBQUM7UUFDMUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDO1lBQzVCLEtBQUssUUFBRSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxLQUFLO1lBQ3RCLFdBQVcsUUFBRSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxXQUFXO1lBQ2xDLElBQUksUUFBRSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxJQUFJO1lBQ3BCLE1BQU0sRUFBRSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsR0FBRztTQUNsQixDQUFDLENBQUM7UUFDSCxNQUFNLGVBQWUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUM5QztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pEO0FBQ0gsQ0FBQztBQXRCRCx3Q0FzQkMifQ==