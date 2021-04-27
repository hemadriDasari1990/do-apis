import socketio, { Socket } from "socket.io";

import { joinMemberToBoard } from "../../controllers/join";

export default function join(io: socketio.Server, socket: Socket) {
  socket.on("join-member-to-board", async (payload: { [Key: string]: any }) => {
    const joined = await joinMemberToBoard(payload);
    io.emit(`join-member-to-board-response`, joined);
  });
}
