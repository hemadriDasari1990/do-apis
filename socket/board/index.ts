import socketio, { Socket } from "socket.io";

import { startOrCompleteBoard } from "../../controllers/board";
// import { decodeToken } from "../../util";

export default function board(io: socketio.Server, socket: Socket) {
  socket.on("start-session", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await startOrCompleteBoard({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`start-session-response`, updated);
  });
  socket.on("end-session", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await startOrCompleteBoard({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`end-session-response`, updated);
  });
}
