"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../controllers/section");
const board_1 = __importDefault(require("./board"));
const member_1 = __importDefault(require("./member"));
// import config from "config";
// import jwt from "jsonwebtoken";
const note_1 = __importDefault(require("./note"));
const project_1 = __importDefault(require("./project"));
const reaction_1 = __importDefault(require("./reaction"));
const section_2 = __importDefault(require("./section"));
function socketEvents(io) {
    // io.sockets.use(function(socket: any, next: any) {
    // socket.set("authorization", (handshakeData: any, accept: any) => {
    //   const domain = handshakeData.headers.referer
    //     .replace("http://", "")
    //     .replace("https://", "")
    //     .split(/[/?#]/)[0];
    //   if ("letsdoretro.com" == domain) accept(null, true);
    //   else return accept("Deny", false);
    // });
    // socket.set('transports', ['websocket']);
    // console.log("socket", socket.handshake?.query);
    // if (socket.handshake.query && socket.handshake.query?.token) {
    //   jwt.verify(
    //     socket.handshake.query?.token,
    //     config.get("refreshTokenSecret"),
    //     function(err: any, decoded: any) {
    //       if (err) {
    //         socket.emit("unauthorised", null);
    //         return next(new Error("Authentication error"));
    //       }
    //       socket.decoded = decoded;
    //       next();
    //     }
    //   );
    // } else {
    //   next(new Error("Authentication error"));
    // }
    // });
    // Set socket.io listeners.
    io.sockets.on("connection", (socket) => {
        console.log("client connected");
        /* Project socket events */
        project_1.default(io, socket);
        /* Board socket events */
        board_1.default(io, socket);
        /* Section socket events */
        section_2.default(io, socket);
        /* Note socket events */
        note_1.default(io, socket);
        /* Reaction socket events */
        reaction_1.default(io, socket);
        /* Member socket events */
        member_1.default(io, socket);
        socket.on("move-note-to-section", async (body) => {
            const updated = await section_1.addAndRemoveNoteFromSection(body);
            socket.emit("move-note-to-section-response", updated, body.source, body.destinaton);
        });
    });
    io.sockets.on("disconnect", () => {
        console.log("client disconnected");
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBcUU7QUFDckUsb0RBQTRCO0FBQzVCLHNEQUE4QjtBQUM5QiwrQkFBK0I7QUFDL0Isa0NBQWtDO0FBQ2xDLGtEQUEwQjtBQUMxQix3REFBZ0M7QUFDaEMsMERBQWtDO0FBQ2xDLHdEQUFnQztBQUVoQyxTQUF3QixZQUFZLENBQUMsRUFBbUI7SUFDdEQsb0RBQW9EO0lBQ3BELHFFQUFxRTtJQUNyRSxpREFBaUQ7SUFDakQsOEJBQThCO0lBQzlCLCtCQUErQjtJQUMvQiwwQkFBMEI7SUFDMUIseURBQXlEO0lBQ3pELHVDQUF1QztJQUN2QyxNQUFNO0lBQ04sMkNBQTJDO0lBQzNDLGtEQUFrRDtJQUNsRCxpRUFBaUU7SUFDakUsZ0JBQWdCO0lBQ2hCLHFDQUFxQztJQUNyQyx3Q0FBd0M7SUFDeEMseUNBQXlDO0lBQ3pDLG1CQUFtQjtJQUNuQiw2Q0FBNkM7SUFDN0MsMERBQTBEO0lBQzFELFVBQVU7SUFDVixrQ0FBa0M7SUFDbEMsZ0JBQWdCO0lBQ2hCLFFBQVE7SUFDUixPQUFPO0lBQ1AsV0FBVztJQUNYLDZDQUE2QztJQUM3QyxJQUFJO0lBQ0osTUFBTTtJQUVOLDJCQUEyQjtJQUMzQixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFaEMsMkJBQTJCO1FBQzNCLGlCQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBCLHlCQUF5QjtRQUN6QixlQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWxCLDJCQUEyQjtRQUMzQixpQkFBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQix3QkFBd0I7UUFDeEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVqQiw0QkFBNEI7UUFDNUIsa0JBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckIsMEJBQTBCO1FBQzFCLGdCQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRW5CLE1BQU0sQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLElBQTRCLEVBQUUsRUFBRTtZQUN2RSxNQUFNLE9BQU8sR0FBRyxNQUFNLHFDQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQ1QsK0JBQStCLEVBQy9CLE9BQU8sRUFDUCxJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxVQUFVLENBQ2hCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBakVELCtCQWlFQyJ9