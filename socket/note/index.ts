import socketio, { Socket } from "socket.io";

import { updateNote, deleteNote, markNoteRead } from "../../controllers/note";
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

  socket.on("delete-note", async (id: string) => {
    const deleted = await deleteNote(id);
    io.emit(`delete-note-response-${id}`, deleted);
  });

  socket.on("mark-note-read", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const create = await markNoteRead({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`mark-note-read-response-${payload?.id}`, create);
  });
}
