"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitedTeams = exports.getInvitedMembers = void 0;
const Invite_1 = __importDefault(require("../../models/Invite"));
const util_1 = require("../../util");
const mongoose_1 = __importDefault(require("mongoose"));
const teamFilters_1 = require("../../util/teamFilters");
async function getInvitedMembers(req, res) {
    try {
        const query = {
            boardId: mongoose_1.default.Types.ObjectId(req.query.boardId),
        };
        const aggregators = [];
        const { limit, offset } = util_1.getPagination(parseInt(req.query.page), parseInt(req.query.size));
        aggregators.push({
            $facet: {
                data: [
                    { $match: query },
                    { $sort: { _id: -1 } },
                    { $skip: offset },
                    { $limit: limit },
                    teamFilters_1.teamLookup,
                    {
                        $unwind: "$team",
                    },
                    {
                        $unwind: "$team.members",
                    },
                    {
                        $unwind: "$team.members.member",
                    },
                    { $replaceRoot: { newRoot: "$team.members.member" } },
                ],
                total: [{ $match: query }, { $count: "count" }],
            },
        });
        const boards = await Invite_1.default.aggregate(aggregators);
        return res.status(200).send(boards ? boards[0] : boards);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getInvitedMembers = getInvitedMembers;
async function createInvitedTeams(teams, boardId) {
    try {
        if (!teams || !Array.isArray(teams) || !(teams === null || teams === void 0 ? void 0 : teams.length) || !boardId) {
            return;
        }
        await teams.reduce(async (promise, id) => {
            await promise;
            const invite = new Invite_1.default({
                boardId: boardId,
                teamId: id,
            });
            await invite.save();
        }, Promise.resolve());
    }
    catch (err) {
        throw `Error while adding team to board ${err || err.message}`;
    }
}
exports.createInvitedTeams = createInvitedTeams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9pbnZpdGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsaUVBQXlDO0FBQ3pDLHFDQUEyQztBQUMzQyx3REFBZ0M7QUFDaEMsd0RBQW9EO0FBRTdDLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsR0FBWSxFQUNaLEdBQWE7SUFFYixJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUc7WUFDWixPQUFPLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBaUIsQ0FBQztTQUM5RCxDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsb0JBQWEsQ0FDckMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBYyxDQUFDLEVBQ2xDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQWMsQ0FBQyxDQUNuQyxDQUFDO1FBQ0YsV0FBVyxDQUFDLElBQUksQ0FBQztZQUNmLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUU7b0JBQ0osRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO29CQUNqQixFQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUN0QixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7b0JBQ2pCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtvQkFDakIsd0JBQVU7b0JBQ1Y7d0JBQ0UsT0FBTyxFQUFFLE9BQU87cUJBQ2pCO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxlQUFlO3FCQUN6QjtvQkFDRDt3QkFDRSxPQUFPLEVBQUUsc0JBQXNCO3FCQUNoQztvQkFDRCxFQUFFLFlBQVksRUFBRSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxFQUFFO2lCQUN0RDtnQkFDRCxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUNoRDtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUQ7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUM7QUF6Q0QsOENBeUNDO0FBRU0sS0FBSyxVQUFVLGtCQUFrQixDQUN0QyxLQUFvQixFQUNwQixPQUF1QztJQUV2QyxJQUFJO1FBQ0YsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsTUFBTSxDQUFBLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakUsT0FBTztTQUNSO1FBQ0QsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBVSxFQUFFLEVBQUU7WUFDL0MsTUFBTSxPQUFPLENBQUM7WUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUM7Z0JBQ3hCLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixNQUFNLEVBQUUsRUFBRTthQUNYLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RCLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUN2QjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxvQ0FBb0MsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoRTtBQUNILENBQUM7QUFuQkQsZ0RBbUJDIn0=