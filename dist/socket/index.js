"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../controllers/section");
const department_1 = require("../controllers/department");
// import config from "config";
// import jwt from "jsonwebtoken";
const section_2 = __importDefault(require("./section"));
const note_1 = __importDefault(require("./note"));
const reaction_1 = __importDefault(require("./reaction"));
const board_1 = __importDefault(require("./board"));
function socketEvents(io) {
    // io.sockets.use(function(socket: any, next: any) {
    //   if (socket.handshake.query && socket.handshake.query?.token) {
    //     jwt.verify(
    //       socket.handshake.query?.token,
    //       config.get("refreshTokenSecret"),
    //       function(err: any, decoded: any) {
    //         if (err) return next(new Error("Authentication error"));
    //         socket.decoded = decoded;
    //         next();
    //       }
    //     );
    //   } else {
    //     next(new Error("Authentication error"));
    //   }
    // });
    // Set socket.io listeners.
    io.sockets.on("connection", (socket) => {
        console.log("socket connected");
        socket.on("disconnect", () => {
            console.log("socket disconnected");
        });
        /* Board socket events */
        board_1.default(io, socket);
        /* Section socket events */
        section_2.default(io, socket);
        /* Note socket events */
        note_1.default(io, socket);
        /* Reaction socket events */
        reaction_1.default(io, socket);
        socket.on("move-note-to-section", async (body) => {
            const updated = await section_1.addAndRemoveNoteFromSection(body);
            socket.emit("move-note-to-section", updated);
        });
        socket.on("get-departments", async (userId) => {
            const departments = await department_1.getDepartments(userId);
            socket.emit("get-departments", departments);
        });
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBcUU7QUFDckUsMERBQTJEO0FBQzNELCtCQUErQjtBQUMvQixrQ0FBa0M7QUFDbEMsd0RBQWdDO0FBQ2hDLGtEQUEwQjtBQUMxQiwwREFBa0M7QUFDbEMsb0RBQTRCO0FBRTVCLFNBQXdCLFlBQVksQ0FBQyxFQUFtQjtJQUN0RCxvREFBb0Q7SUFDcEQsbUVBQW1FO0lBQ25FLGtCQUFrQjtJQUNsQix1Q0FBdUM7SUFDdkMsMENBQTBDO0lBQzFDLDJDQUEyQztJQUMzQyxtRUFBbUU7SUFDbkUsb0NBQW9DO0lBQ3BDLGtCQUFrQjtJQUNsQixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYiwrQ0FBK0M7SUFDL0MsTUFBTTtJQUNOLE1BQU07SUFFTiwyQkFBMkI7SUFDM0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUU7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFDekIsZUFBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsQiwyQkFBMkI7UUFDM0IsaUJBQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEIsd0JBQXdCO1FBQ3hCLGNBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFakIsNEJBQTRCO1FBQzVCLGtCQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXJCLE1BQU0sQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLElBQTRCLEVBQUUsRUFBRTtZQUN2RSxNQUFNLE9BQU8sR0FBRyxNQUFNLHFDQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxNQUFjLEVBQUUsRUFBRTtZQUNwRCxNQUFNLFdBQVcsR0FBRyxNQUFNLDJCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTlDRCwrQkE4Q0MifQ==