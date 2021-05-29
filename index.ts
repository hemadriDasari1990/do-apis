import { Request, Response } from "express";

import ApplicationServer from "./server";
import config from "config";
import cors from "cors";
import { createServer } from "http";
import socketEvents from "./socket";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const app = new ApplicationServer().bootstrap();
const server = createServer(app);
server.listen(config.get("port"));
server.on("listening", onListening);
server.on("error", onError);

const socket = require("socket.io")(server, {
  cors: {
    origin: config.get("url"),
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

function onListening() {
  console.log("🚀  server listening on port:", config.get("port"));
}

function onError(error: any) {
  console.log("There was an error:", error);
}

// Add headers
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send(`This is a landing page for letsdoretro service`);
});

socketEvents(socket);

export { socket };
