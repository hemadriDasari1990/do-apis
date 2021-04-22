import {
  changeVisibility,
  startOrCompleteBoard,
} from "../../controllers/board";
import { decodeToken, verifyToken } from "../../util";
import socketio, { Socket } from "socket.io";

import { inviteMemberToBoard } from "../../controllers/board";

// import { decodeToken } from "../../util";

export default function board(io: socketio.Server, socket: Socket) {
  socket.on("start-session", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      await verifyToken(query?.token, io);
      const user: any = decodeToken(query?.token);
      const updated = await startOrCompleteBoard({
        ...payload,
        user,
      });
      io.emit(`start-session-response`, updated);
    } catch (err) {
      return err;
    }
  });
  socket.on("end-session", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      await verifyToken(query?.token, io);
      const user: any = decodeToken(query?.token);
      const updated = await startOrCompleteBoard({
        ...payload,
        user,
      });
      io.emit(`end-session-response`, updated);
    } catch (err) {
      return err;
    }
  });

  socket.on("change-visibility", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      await verifyToken(query?.token, io);
      const user: any = decodeToken(query?.token);
      const updated = await changeVisibility({
        ...payload,
        user,
      });
      io.emit(`change-visibility-response`, updated);
    } catch (err) {
      return err;
    }
  });

  socket.on(
    "invite-member-to-board",
    async (payload: { [Key: string]: any }) => {
      try {
        const query: any = socket.handshake.query;
        await verifyToken(query?.token, io);
        const user: any = decodeToken(query?.token);
        const sent = await inviteMemberToBoard({ ...payload, user });
        await io.emit(`invite-member-to-board-response`, sent);
      } catch (err) {
        return err;
      }
    }
  );
}
