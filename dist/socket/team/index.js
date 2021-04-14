"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const team_1 = require("../../controllers/team");
const mongoose_1 = __importDefault(require("mongoose"));
// import { decodeToken } from "../../util";
function team(io, socket) {
    socket.on("get-teams", async (userId) => {
        const teams = await team_1.getTeams({
            userId: mongoose_1.default.Types.ObjectId(userId),
        });
        io.emit(`get-teams-response`, teams);
    });
}
exports.default = team;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvdGVhbS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLGlEQUFrRDtBQUNsRCx3REFBZ0M7QUFFaEMsNENBQTRDO0FBRTVDLFNBQXdCLElBQUksQ0FBQyxFQUFtQixFQUFFLE1BQWM7SUFDOUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQWMsRUFBRSxFQUFFO1FBQzlDLE1BQU0sS0FBSyxHQUFHLE1BQU0sZUFBUSxDQUFDO1lBQzNCLE1BQU0sRUFBRSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQ3hDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBUEQsdUJBT0MifQ==