import { decodeToken, verifyToken } from "../../util";
import { deleteAction, updateAction } from "../../controllers/action";
import socketio, { Socket } from "socket.io";

export default function action(io: socketio.Server, socket: Socket) {
  socket.on("update-action", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const updated = await updateAction({
        ...payload,
        user: decodeToken(query?.token),
      });
      io.emit(`update-action-response`, updated);
    } catch (err) {
      return err;
    }
  });

  socket.on("create-action", async (payload: { [Key: string]: any }) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const created = await updateAction({
        ...payload,
      });
      io.emit(`create-action-response`, created);
      io.emit(`action-created`, created);
    } catch (err) {
      return err;
    }
  });

  socket.on("delete-action", async (actionId: string) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const deleted = await deleteAction(actionId);
      io.emit(`delete-action-response`, deleted);
    } catch (err) {
      return err;
    }
  });
}
