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
    io.emit(`update-note-response-${payload?.sectionId}`, updated);
  });

  socket.on(`create-note`, async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const created = await updateNote({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    if (created?._id) {
      io.emit(`plus-note-count-response`, created);
    }
    io.emit(`create-note-response-${payload?.sectionId}`, created);
  });

  socket.on("delete-note", async (payload: { [Key: string]: any }) => {
    const deleted = await deleteNote(
      payload?.id,
      payload?.userId,
      payload?.sectionId
    );
    if (deleted?.deleted) {
      io.emit(`minus-note-count-response`, deleted);
    }
    io.emit(`delete-note-response-${payload?.sectionId}`, deleted);
  });

  socket.on("mark-note-read", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const create = await markNoteRead({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`mark-note-read-response`, create);
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
