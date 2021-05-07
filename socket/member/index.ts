import socketio, { Socket } from "socket.io";

import { searchMembers } from "../../controllers/member";
import { verifyToken } from "../../util";

export default function member(io: socketio.Server, socket: Socket) {
  socket.on("search-members", async (payload: { [Key: string]: any }) => {
    const query: any = socket.handshake.query;
    await verifyToken(query?.token, io);
    const members = await searchMembers(payload);
    io.emit(`search-members-response`, members);
  });
}
