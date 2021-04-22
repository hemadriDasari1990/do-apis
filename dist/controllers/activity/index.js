"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivities = exports.createActivity = void 0;
const activity_1 = __importDefault(require("../../models/activity"));
const util_1 = require("../../util");
const mongoose_1 = __importDefault(require("mongoose"));
const projectFilters_1 = require("../../util/projectFilters");
async function createActivity(payload) {
    try {
        const activity = new activity_1.default(payload);
        return await activity.save();
    }
    catch (err) {
        throw new Error(`Error while creating activity ${err || err.message}`);
    }
}
exports.createActivity = createActivity;
async function getActivities(req, res) {
    var _a;
    try {
        const query = {
            boardId: mongoose_1.default.Types.ObjectId(req.query.boardId),
        };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        if ((_a = req.query.queryString) === null || _a === void 0 ? void 0 : _a.length) {
            aggregators.push({
                $match: {
                    $or: [{ title: { $regex: req.query.queryString, $options: "i" } }],
                },
            });
        }
        aggregators.push({
            $facet: {
                data: [
                    { $match: query },
                    { $sort: { _id: -1 } },
                    { $skip: offset },
                    { $limit: limit },
                    projectFilters_1.userLookup,
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
        const activities = await activity_1.default.aggregate(aggregators);
        return res.status(200).send(activities ? activities[0] : activities);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getActivities = getActivities;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hY3Rpdml0eS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFDN0MscUNBQTJDO0FBQzNDLHdEQUFnQztBQUNoQyw4REFBdUQ7QUFFaEQsS0FBSyxVQUFVLGNBQWMsQ0FBQyxPQUVwQztJQUNDLElBQUk7UUFDRixNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsT0FBTyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM5QjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0gsQ0FBQztBQVRELHdDQVNDO0FBRU0sS0FBSyxVQUFVLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTs7SUFDN0QsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHO1lBQ1osT0FBTyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQWlCLENBQUM7U0FDOUQsQ0FBQztRQUNGLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLG9CQUFhLENBQ3JDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQWMsQ0FBQyxFQUNsQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFjLENBQUMsQ0FDbkMsQ0FBQztRQUNGLFVBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLDBDQUFFLE1BQU0sRUFBRTtZQUNqQyxXQUFXLENBQUMsSUFBSSxDQUFDO2dCQUNmLE1BQU0sRUFBRTtvQkFDTixHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztpQkFDbkU7YUFDRixDQUFDLENBQUM7U0FDSjtRQUNELFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDZixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFO29CQUNKLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtvQkFDakIsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDdEIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO29CQUNqQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7b0JBQ2pCLDJCQUFVO29CQUNWO3dCQUNFLE9BQU8sRUFBRTs0QkFDUCxJQUFJLEVBQUUsT0FBTzs0QkFDYiwwQkFBMEIsRUFBRSxJQUFJO3lCQUNqQztxQkFDRjtpQkFDRjtnQkFDRCxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUNoRDtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLE1BQU0sa0JBQVEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdEU7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUF6Q0Qsc0NBeUNDIn0=