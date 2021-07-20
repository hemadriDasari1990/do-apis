import {
  changeVisibility,
  startOrCompleteBoard,
  getBoardDetailsWithMembers,
  enableReactions,
} from "../../controllers/board";
import { decodeToken, verifyToken } from "../../util";
import socketio, { Socket } from "socket.io";

import { inviteMemberToBoard } from "../../controllers/board";
import { getJoinedMember } from "../../controllers/join";

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

  socket.on("resume-session", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      await verifyToken(query?.token, io);
      const user: any = decodeToken(query?.token);
      const updated = await startOrCompleteBoard({
        ...payload,
        user,
      });
      io.emit(`resume-session-response`, updated);
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

  socket.on("board-details", async (payload: { [Key: string]: any }) => {
    try {
      const boardDetails = await getBoardDetailsWithMembers(payload?.id, null);
      await io.emit(`board-details-response`, boardDetails);
    } catch (err) {
      return err;
    }
  });

  socket.on("show-reaction", async (payload: { [Key: string]: any }) => {
    try {
      const joinedMember: any = await getJoinedMember(
        { _id: payload?.joinedMemberId },
        null
      );
      if (joinedMember) {
        joinedMember.type = payload?.type;
      }
      await io.emit(`show-reaction`, joinedMember);
    } catch (err) {
      return err;
    }
  });

  socket.on("enable-reactions", async (payload: { [Key: string]: any }) => {
    try {
      const boardUpdated = await enableReactions(
        payload?.boardId,
        payload?.enableReactions
      );
      await io.emit(`enable-reactions`, boardUpdated);
    } catch (err) {
      return err;
    }
  });
}
