"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../controllers/section");
// import config from "config";
// import jwt from "jsonwebtoken";
const section_2 = __importDefault(require("./section"));
const note_1 = __importDefault(require("./note"));
const reaction_1 = __importDefault(require("./reaction"));
const board_1 = __importDefault(require("./board"));
const department_1 = __importDefault(require("./department"));
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
        /* Department socket events */
        department_1.default(io, socket);
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
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBcUU7QUFDckUsK0JBQStCO0FBQy9CLGtDQUFrQztBQUNsQyx3REFBZ0M7QUFDaEMsa0RBQTBCO0FBQzFCLDBEQUFrQztBQUNsQyxvREFBNEI7QUFDNUIsOERBQXNDO0FBRXRDLFNBQXdCLFlBQVksQ0FBQyxFQUFtQjtJQUN0RCxvREFBb0Q7SUFDcEQsbUVBQW1FO0lBQ25FLGtCQUFrQjtJQUNsQix1Q0FBdUM7SUFDdkMsMENBQTBDO0lBQzFDLDJDQUEyQztJQUMzQyxtRUFBbUU7SUFDbkUsb0NBQW9DO0lBQ3BDLGtCQUFrQjtJQUNsQixVQUFVO0lBQ1YsU0FBUztJQUNULGFBQWE7SUFDYiwrQ0FBK0M7SUFDL0MsTUFBTTtJQUNOLE1BQU07SUFFTiwyQkFBMkI7SUFDM0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUU7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCw4QkFBOEI7UUFDOUIsb0JBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFdkIseUJBQXlCO1FBQ3pCLGVBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbEIsMkJBQTJCO1FBQzNCLGlCQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBCLHdCQUF3QjtRQUN4QixjQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpCLDRCQUE0QjtRQUM1QixrQkFBUSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyQixNQUFNLENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxJQUE0QixFQUFFLEVBQUU7WUFDdkUsTUFBTSxPQUFPLEdBQUcsTUFBTSxxQ0FBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBNUNELCtCQTRDQyJ9