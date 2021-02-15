import socketio, { Socket } from 'socket.io';

export default function socketEvents(io: socketio.Server) {
    // Set socket.io listeners.
    io.sockets.on('connection', (socket: Socket) => {
      // socket.on('typing', (sectionId: string) => {
      //   socket.emit('typing', sectionId);
      // });
      socket.on('disconnect', () => {
        console.log("socket discenncted")
      });
    });
  };
  