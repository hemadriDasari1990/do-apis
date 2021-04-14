import socketio, { Socket } from "socket.io";

import { getProjectsByUser } from "../../controllers/project";

// import { decodeToken } from "../../util";

export default function project(io: socketio.Server, socket: Socket) {
  socket.on("get-projects", async (userId: string) => {
    const projects = await getProjectsByUser(userId);
    io.emit(`get-projects-response`, projects);
  });
}
