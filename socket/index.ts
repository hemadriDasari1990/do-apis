import socketio, { Socket } from 'socket.io';

export default function socketEvents(io: socketio.Server) {
    // Set socket.io listeners.
    io.sockets.on('connection', (socket: Socket) => {
      console.log("socket cenncted", 123)
      socket.on('hi', data => {
        console.log("hello", data);
      });
  
      socket.on('update post', data => {
        socket.emit('update post', data)
      });
  
      socket.on('disconnect', () => {
        console.log("socket discenncted")
      });
    });
  };
  