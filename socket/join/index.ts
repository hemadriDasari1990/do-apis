import socketio, { Socket } from "socket.io";
export default function join(io: socketio.Server, socket: Socket) {
  // socket.on(
  //   "check-if-member-joined-board",
  //   async (payload: { [Key: string]: any }) => {
  //     const joined = await checkIfMemberJoinedBoard(payload);
  //     io.emit(`check-if-member-joined-board-response`, joined);
  //   }
  // );
}
