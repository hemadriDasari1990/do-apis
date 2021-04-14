import socketio, { Socket } from "socket.io";

import { getTeams } from "../../controllers/team";
import mongoose from "mongoose";

// import { decodeToken } from "../../util";

export default function team(io: socketio.Server, socket: Socket) {
  socket.on("get-teams", async (userId: string) => {
    const teams = await getTeams({
      userId: mongoose.Types.ObjectId(userId),
    });
    io.emit(`get-teams-response`, teams);
  });
}
