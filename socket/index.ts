import socketio, { Socket } from "socket.io";

import { addAndRemoveNoteFromSection } from "../controllers/section";
import { getDepartments } from "../controllers/department";
// import config from "config";
// import jwt from "jsonwebtoken";
import section from "./section";
import note from "./note";
import reaction from "./reaction";
import board from "./board";

export default function socketEvents(io: socketio.Server) {
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
  io.sockets.on("connection", (socket: Socket) => {
    console.log("socket connected");
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    /* Board socket events */
    board(io, socket);

    /* Section socket events */
    section(io, socket);

    /* Note socket events */
    note(io, socket);

    /* Reaction socket events */
    reaction(io, socket);

    socket.on("move-note-to-section", async (body: { [Key: string]: any }) => {
      const updated = await addAndRemoveNoteFromSection(body);
      socket.emit("move-note-to-section", updated);
    });

    socket.on("get-departments", async (userId: string) => {
      const departments = await getDepartments(userId);
      socket.emit("get-departments", departments);
    });
  });
}
