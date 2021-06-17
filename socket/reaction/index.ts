import socketio, { Socket } from "socket.io";

import { createOrUpdateReaction } from "../../controllers/reaction";

export default function reaction(io: socketio.Server, socket: Socket) {
  socket.on("add-reaction", async (payload: { [Key: string]: any }) => {
    const reactionUpdated = await createOrUpdateReaction({
      ...payload,
      reactedBy: payload?.joinedMemberId,
      //   ...decodeToken(query?.token),
    });

    io.emit(`add-reaction-response-${payload?.sectionId}`, reactionUpdated);
  });
}
