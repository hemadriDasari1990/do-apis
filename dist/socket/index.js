"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../controllers/section");
const board_1 = __importDefault(require("./board"));
// import config from "config";
const department_1 = __importDefault(require("./department"));
// import jwt from "jsonwebtoken";
const note_1 = __importDefault(require("./note"));
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
    io.sockets.on("disconnect", () => {
        console.log("client disconnected");
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBcUU7QUFDckUsb0RBQTRCO0FBQzVCLCtCQUErQjtBQUMvQiw4REFBc0M7QUFDdEMsa0NBQWtDO0FBQ2xDLGtEQUEwQjtBQUMxQiwwREFBa0M7QUFDbEMsd0RBQWdDO0FBRWhDLFNBQXdCLFlBQVksQ0FBQyxFQUFtQjtJQUN0RCxvREFBb0Q7SUFDcEQscUVBQXFFO0lBQ3JFLGlEQUFpRDtJQUNqRCw4QkFBOEI7SUFDOUIsK0JBQStCO0lBQy9CLDBCQUEwQjtJQUMxQix5REFBeUQ7SUFDekQsdUNBQXVDO0lBQ3ZDLE1BQU07SUFDTiwyQ0FBMkM7SUFDM0Msa0RBQWtEO0lBQ2xELGlFQUFpRTtJQUNqRSxnQkFBZ0I7SUFDaEIscUNBQXFDO0lBQ3JDLHdDQUF3QztJQUN4Qyx5Q0FBeUM7SUFDekMsbUJBQW1CO0lBQ25CLDZDQUE2QztJQUM3QywwREFBMEQ7SUFDMUQsVUFBVTtJQUNWLGtDQUFrQztJQUNsQyxnQkFBZ0I7SUFDaEIsUUFBUTtJQUNSLE9BQU87SUFDUCxXQUFXO0lBQ1gsNkNBQTZDO0lBQzdDLElBQUk7SUFDSixNQUFNO0lBRU4sMkJBQTJCO0lBQzNCLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyw4QkFBOEI7UUFDOUIsb0JBQVUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFdkIseUJBQXlCO1FBQ3pCLGVBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbEIsMkJBQTJCO1FBQzNCLGlCQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXBCLHdCQUF3QjtRQUN4QixjQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpCLDRCQUE0QjtRQUM1QixrQkFBUSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyQixNQUFNLENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxJQUE0QixFQUFFLEVBQUU7WUFDdkUsTUFBTSxPQUFPLEdBQUcsTUFBTSxxQ0FBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF4REQsK0JBd0RDIn0=