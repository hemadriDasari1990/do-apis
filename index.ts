import { Request, Response } from 'express';

import ApplicationServer from './server';
import config from 'config';
import { createServer } from 'http';
import socketEvents from "./socket";

const io = require("socket.io");

const app = new ApplicationServer().bootstrap();
const server = createServer(app);
server.listen(config.get("port"));
server.on('listening', onListening);
server.on('error', onError);

function onListening() {
  console.log('🚀  server listening on port:', config.get("port"));
}

function onError(error: any) {
  console.log('There was an error:', error);
}

app.get("/", (req: Request, res: Response) => {
  console.log(req);
    res.send(`This is a landing page for letsdoretro service`);
});

// socket.io handlers
let socket = io(server, {
  // enable cors
  origins: '*:*'
})
// io.set('origins', '*:*')
socketEvents(socket);

export { socket };