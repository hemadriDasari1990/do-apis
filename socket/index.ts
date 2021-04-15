import socketio, { Socket } from "socket.io";

import { addAndRemoveNoteFromSection } from "../controllers/section";
import board from "./board";
import member from "./member";
// import config from "config";
// import jwt from "jsonwebtoken";
import note from "./note";
import project from "./project";
import reaction from "./reaction";
import section from "./section";

export default function socketEvents(io: socketio.Server) {
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
  io.sockets.on("connection", (socket: Socket) => {
    console.log("client connected");

    /* Project socket events */
    project(io, socket);

    /* Board socket events */
    board(io, socket);

    /* Section socket events */
    section(io, socket);

    /* Note socket events */
    note(io, socket);

    /* Reaction socket events */
    reaction(io, socket);

    /* Member socket events */
    member(io, socket);

    socket.on("move-note-to-section", async (body: { [Key: string]: any }) => {
      const updated = await addAndRemoveNoteFromSection(body);
      socket.emit(
        "move-note-to-section-response",
        updated,
        body.source,
        body.destinaton
      );
    });
  });
  io.sockets.on("disconnect", () => {
    console.log("client disconnected");
  });
}
