import { decodeToken, verifyToken } from "../../util";
import { deleteSection, updateSection } from "../../controllers/section";
import socketio, { Socket } from "socket.io";

export default function section(io: socketio.Server, socket: Socket) {
  socket.on("update-section", async (payload: { [Key: string]: any }) => {
    try {
      console.log("socket", socket.handshake?.query);
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const updated = await updateSection({
        ...payload,
        user: decodeToken(query?.token),
      });
      console.log("updated", updated);
      io.emit(`update-section-response`, updated);
    } catch (err) {
      throw err;
    }
  });

  socket.on("create-section", async (payload: { [Key: string]: any }) => {
    try {
      console.log("socket12", socket.handshake?.query);
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const created = await updateSection({
        ...payload,
        //   ...decodeToken(query?.token),
      });
      console.log("created", created);
      io.emit(`create-section-response`, created);
    } catch (err) {
      throw err;
    }
  });

  socket.on("delete-section", async (sectionId: string) => {
    try {
      const query: any = socket.handshake.query;
      verifyToken(query?.token, io);
      const user: any = decodeToken(query?.token);
      const deleted = await deleteSection(sectionId, user?._id);
      io.emit(`delete-section-response`, deleted);
    } catch (err) {
      throw err;
    }
  });
}
