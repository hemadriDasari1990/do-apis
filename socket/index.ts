import socketio, { Socket } from "socket.io";

import { addAndRemoveNoteFromSection } from "../controllers/section";
import { getDepartments } from "../controllers/department";

export default function socketEvents(io: socketio.Server) {
  // Set socket.io listeners.
  io.sockets.on("connection", (socket: Socket) => {
    // socket.on('typing', (sectionId: string) => {
    //   socket.emit('typing', sectionId);
    // });
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    socket.on("move-note-to-section", async (body: { [Key: string]: any }) => {
      const updated = await addAndRemoveNoteFromSection(body);
      socket.emit("move-note-to-section", updated);
    });

    socket.on("get-departments", async (userId: string) => {
      const departments = await getDepartments(userId);
      socket.emit("get-departmentsn", departments);
    });
  });
}
