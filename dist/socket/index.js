"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __importDefault(require("./board"));
const member_1 = __importDefault(require("./member"));
// import config from "config";
// import jwt from "jsonwebtoken";
const note_1 = __importDefault(require("./note"));
const project_1 = __importDefault(require("./project"));
const reaction_1 = __importDefault(require("./reaction"));
const section_1 = __importDefault(require("./section"));
const action_1 = __importDefault(require("./action"));
const actionItem_1 = __importDefault(require("./actionItem"));
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
        section_1.default(io, socket);
        /* Note socket events */
        note_1.default(io, socket);
        /* Action socket events */
        action_1.default(io, socket);
        /* Action Item socket events */
        actionItem_1.default(io, socket);
        /* Reaction socket events */
        reaction_1.default(io, socket);
        /* Member socket events */
        member_1.default(io, socket);
    });
    io.sockets.on("disconnect", () => {
        console.log("client disconnected");
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxvREFBNEI7QUFDNUIsc0RBQThCO0FBQzlCLCtCQUErQjtBQUMvQixrQ0FBa0M7QUFDbEMsa0RBQTBCO0FBQzFCLHdEQUFnQztBQUNoQywwREFBa0M7QUFDbEMsd0RBQWdDO0FBQ2hDLHNEQUE4QjtBQUM5Qiw4REFBc0M7QUFFdEMsU0FBd0IsWUFBWSxDQUFDLEVBQW1CO0lBQ3RELG9EQUFvRDtJQUNwRCxxRUFBcUU7SUFDckUsaURBQWlEO0lBQ2pELDhCQUE4QjtJQUM5QiwrQkFBK0I7SUFDL0IsMEJBQTBCO0lBQzFCLHlEQUF5RDtJQUN6RCx1Q0FBdUM7SUFDdkMsTUFBTTtJQUNOLDJDQUEyQztJQUMzQyxrREFBa0Q7SUFDbEQsaUVBQWlFO0lBQ2pFLGdCQUFnQjtJQUNoQixxQ0FBcUM7SUFDckMsd0NBQXdDO0lBQ3hDLHlDQUF5QztJQUN6QyxtQkFBbUI7SUFDbkIsNkNBQTZDO0lBQzdDLDBEQUEwRDtJQUMxRCxVQUFVO0lBQ1Ysa0NBQWtDO0lBQ2xDLGdCQUFnQjtJQUNoQixRQUFRO0lBQ1IsT0FBTztJQUNQLFdBQVc7SUFDWCw2Q0FBNkM7SUFDN0MsSUFBSTtJQUNKLE1BQU07SUFFTiwyQkFBMkI7SUFDM0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUU7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRWhDLDJCQUEyQjtRQUMzQixpQkFBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwQix5QkFBeUI7UUFDekIsZUFBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsQiwyQkFBMkI7UUFDM0IsaUJBQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEIsd0JBQXdCO1FBQ3hCLGNBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFakIsMEJBQTBCO1FBQzFCLGdCQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRW5CLCtCQUErQjtRQUMvQixvQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2Qiw0QkFBNEI7UUFDNUIsa0JBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckIsMEJBQTBCO1FBQzFCLGdCQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBN0RELCtCQTZEQyJ9