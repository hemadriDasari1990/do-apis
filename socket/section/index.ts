import socketio, { Socket } from "socket.io";

import { updateSection, deleteSection } from "../../controllers/section";
// import { decodeToken } from "../../util";

export default function section(io: socketio.Server, socket: Socket) {
  socket.on("update-section", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const updated = await updateSection({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`update-section-response`, updated);
  });

  socket.on("create-section", async (payload: { [Key: string]: any }) => {
    // const query: any = socket.handshake.query;
    const create = await updateSection({
      ...payload,
      //   ...decodeToken(query?.token),
    });
    io.emit(`create-section-response`, create);
  });

  socket.on("delete-section", async (sectionId: string) => {
    const deleted = await deleteSection(sectionId);
    io.emit(`delete-section-response`, deleted);
  });
}
