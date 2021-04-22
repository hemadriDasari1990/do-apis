import {
  deleteActionItem,
  updateActionItem,
} from "../../controllers/actionItem";
import socketio, { Socket } from "socket.io";

export default function actionItem(io: socketio.Server, socket: Socket) {
  socket.on("update-actionItem", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await updateActionItem({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`update-actionItem-response-${payload?.sectionId}`, updated);
  });

  socket.on(`create-actionItem`, async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const created = await updateActionItem({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    if (created?._id) {
      io.emit(`plus-actionItem-count-response`, created);
    }
    io.emit(`create-actionItem-response-${payload?.sectionId}`, created);
  });

  socket.on("delete-actionItem", async (payload: { [Key: string]: any }) => {
    const deleted = await deleteActionItem(payload?.id, payload?.actionId);
    if (deleted?.deleted) {
      io.emit(`minus-actionItem-count-response`, deleted);
    }
    io.emit(`delete-actionItem-response-${payload?.sectionId}`, deleted);
  });
}
