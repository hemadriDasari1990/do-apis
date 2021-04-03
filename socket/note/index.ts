import {
  deleteNote,
  markNoteRead,
  updateNote,
  updateNotePosition,
} from "../../controllers/note";
import socketio, { Socket } from "socket.io";

// import { decodeToken } from "../../util";

export default function note(io: socketio.Server, socket: Socket) {
  socket.on("update-note", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await updateNote({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`update-note-response-${updated?._id}`, updated);
  });

  socket.on("create-note", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const create = await updateNote({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`create-note-response-${payload?.sectionId}`, create);
  });

  socket.on("delete-note", async (payload: { [Key: string]: any }) => {
    const deleted = await deleteNote(payload?.id, payload?.userId);
    io.emit(`delete-note-response-${payload?.id}`, deleted);
  });

  socket.on("mark-note-read", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const create = await markNoteRead({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`mark-note-read-response-${payload?.id}`, create);
  });

  socket.on("update-note-position", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await updateNotePosition({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`update-note-position-response`, updated);
  });
}
