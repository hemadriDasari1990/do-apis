"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("../../controllers/board");
// import { decodeToken } from "../../util";
function board(io, socket) {
    socket.on("start-session", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await board_1.startOrCompleteBoard(Object.assign({}, payload));
        io.emit(`start-session-response`, updated);
    });
    socket.on("end-session", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await board_1.startOrCompleteBoard(Object.assign({}, payload));
        io.emit(`end-session-response`, updated);
    });
}
exports.default = board;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvYm9hcmQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtREFBK0Q7QUFDL0QsNENBQTRDO0FBRTVDLFNBQXdCLEtBQUssQ0FBQyxFQUFtQixFQUFFLE1BQWM7SUFDL0QsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNuRSw2Q0FBNkM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsTUFBTSw0QkFBb0IsbUJBQ3JDLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDakUsNkNBQTZDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0sNEJBQW9CLG1CQUNyQyxPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBakJELHdCQWlCQyJ9