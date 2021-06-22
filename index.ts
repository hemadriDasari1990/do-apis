import { Request, Response } from "express";

import ApplicationServer from "./server";
import config from "config";
import cors from "cors";
import { createServer } from "https";
import fs from "fs";
import socketEvents from "./socket";

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const app = new ApplicationServer().bootstrap();
const privateKey = fs.readFileSync(
  "/home/ubuntu/certificates/privkey.pem",
  "utf8"
); // key
const certificate = fs.readFileSync(
  "/home/ubuntu/certificates/cert.pem",
  "utf8"
); // certificate
const ca = fs.readFileSync("/home/ubuntu/certificates/chain.pem", "utf8"); // chain
const credentials: { [Key: string]: any } = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const server = createServer(credentials, app);
server.listen(config.get("port"));
server.on("listening", onListening);
server.on("error", onError);

const socket = require("socket.io")(server, {
  cors: {
    origins: [config.get("url")],
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

const corsOptions: any = {
  origin: config.get("url"),
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, PUT, POST, DELETE",
};
// Add headers
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send(`This is a landing page for letsdoretro service`);
});

socketEvents(socket);

export { socket };
