import { Request, Response, } from 'express';

import ApplicationServer from './server';
import config from 'config';
import { createServer } from 'http';

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
    res.send(`This is a landing page for letsdoretro service`);
});