import socketio, { Socket } from "socket.io";

import { searchMembers } from "../../controllers/member";

export default function member(io: socketio.Server, socket: Socket) {
  socket.on("search-members", async (queryString: string) => {
    const members = await searchMembers(queryString);
    io.emit(`search-members-response`, members);
  });
}
