import socketio, { Socket } from "socket.io";

import { createOrUpdateReaction } from "../../controllers/reaction";
import { decodeToken } from "../../util";

export default function reaction(io: socketio.Server, socket: Socket) {
  socket.on("add-reaction", async (payload: { [Key: string]: any }) => {
    const query: any = socket.handshake.query;
    const user: any = decodeToken(query?.token);
    const reactionUpdated = await createOrUpdateReaction({
      ...payload,
      reactedBy: user?.memberId,
      //   ...decodeToken(query?.token),
    });

    io.emit(`add-reaction-response-${payload?.sectionId}`, reactionUpdated);
  });
}
