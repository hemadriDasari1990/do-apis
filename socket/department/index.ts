import socketio, { Socket } from "socket.io";

import { getDepartments } from "../../controllers/department";

export default function department(io: socketio.Server, socket: Socket) {
  socket.on("get-departments", async (userId: string) => {
    const departments = await getDepartments(userId);
    io.emit("get-departments-response", departments);
  });
}
