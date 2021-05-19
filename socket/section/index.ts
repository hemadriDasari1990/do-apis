import { decodeToken, verifyToken } from "../../util";
import {
  deleteSection,
  updateSection,
  changeSectionPosition,
} from "../../controllers/section";
import socketio, { Socket } from "socket.io";

export default function section(io: socketio.Server, socket: Socket) {
  socket.on("update-section", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const updated = await updateSection({
        ...payload,
        user: decodeToken(query?.token),
      });
      io.emit(`update-section-response`, updated);
    } catch (err) {
      return err;
    }
  });

  socket.on("create-section", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const created = await updateSection({
        ...payload,
      });
      io.emit(`create-section-response`, created);
      io.emit("plus-total-section-response", created);
    } catch (err) {
      return err;
    }
  });

  socket.on("delete-section", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const user: any = decodeToken(query?.token);
      const deleted = await deleteSection(
        payload.id,
        user?.memberId,
        payload.boardId
      );
      io.emit(`delete-section-response`, deleted);
      io.emit("minus-total-section-response", deleted);
    } catch (err) {
      return err;
    }
  });

  socket.on(
    "update-section-position",
    async (payload: { [Key: string]: any }) => {
      try {
        const query: any = socket.handshake.query;
        verifyToken(query?.token, io);
        const updated = await changeSectionPosition(
          payload.sourceSection,
          payload.destinationSection
        );
        io.emit("update-section-position-response", {
          ...updated,
          destinationIndex: payload.destinationIndex,
          sourceIndex: payload.sourceIndex,
        });
      } catch (err) {
        return err;
      }
    }
  );
}
