import {
  deleteNote,
  markNoteRead,
  updateNote,
  updateNotePosition,
} from "../../controllers/note";
import socketio, { Socket } from "socket.io";

import { addAndRemoveNoteFromSection } from "../../controllers/section";
import { decodeToken } from "../../util";

export default function note(io: socketio.Server, socket: Socket) {
  socket.on("update-note", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    // const user: any = decodeToken(query?.token);
    const updated = await updateNote({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`update-note-response-${payload?.sectionId}`, updated);
  });

  socket.on(`create-note`, async (payload: { [Key: string]: any }) => {
    const query: any = socket.handshake.query;
    const user: any = decodeToken(query?.token);
    const created = await updateNote({
      ...payload,
      createdById: user?.memberId || payload?.createdById,
      updatedById: user?.memberId || payload?.updatedById,
      //   ...decodeToken(query?.token),
    });
    if (created?._id) {
      io.emit(`plus-note-count-response`, created);
    }
    io.emit(`create-note-response-${payload?.sectionId}`, created);
  });

  socket.on("delete-note", async (payload: { [Key: string]: any }) => {
    const deleted = await deleteNote(payload);
    if (deleted?.deleted) {
      io.emit(`minus-note-count-response`, deleted);
    }
    io.emit(`delete-note-response-${payload?.sectionId}`, deleted);
  });

  socket.on("mark-note-read", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const created = await markNoteRead({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`mark-note-read-response-${created?.sectionId}`, created);
  });

  socket.on("update-note-position", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await updateNotePosition({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`update-note-position-response-${payload?.sectionId}`, updated);
  });

  socket.on("move-note-to-section", async (payload: { [Key: string]: any }) => {
    const noteDetails = await addAndRemoveNoteFromSection(payload);
    io.emit(
      `move-note-to-source-section-response-${payload.sourceSectionId}`,
      payload.source
    );
    io.emit(
      `move-note-to-destination-section-response-${payload.destinationSectionId}`,
      noteDetails,
      payload.destination
    );
    io.emit(`minus-note-count-response`, {
      sectionId: payload.sourceSectionId,
    });
    io.emit(`plus-note-count-response`, {
      sectionId: payload.destinationSectionId,
    });
  });
}
