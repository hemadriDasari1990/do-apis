"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const server_1 = __importDefault(require("./server"));
const config_1 = __importDefault(require("config"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = __importDefault(require("./socket"));
const app = new server_1.default().bootstrap();
const server = http_1.createServer(app);
server.listen(config_1.default.get("port"));
server.on("listening", onListening);
server.on("error", onError);
const socket = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
});
exports.socket = socket;
function onListening() {
    console.log("🚀  server listening on port:", config_1.default.get("port"));
}
function onError(error) {
    console.log("There was an error:", error);
}
// Add headers
app.use(cors_1.default());
app.get("/", (req, res) => {
    console.log(req);
    res.send(`This is a landing page for letsdoretro service`);
});
socket_1.default(socket);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxzREFBeUM7QUFDekMsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUN4QiwrQkFBb0M7QUFDcEMsc0RBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQWlCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoRCxNQUFNLE1BQU0sR0FBRyxtQkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNsQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU1QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxFQUFFO0lBQzFDLElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSx1QkFBdUI7UUFDL0IsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO0tBRTFDO0lBQ0QsWUFBWSxFQUFFLEtBQUs7SUFDbkIsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLEtBQUs7Q0FDZCxDQUFDLENBQUM7QUFvQk0sd0JBQU07QUFsQmYsU0FBUyxXQUFXO0lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsS0FBVTtJQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFFRCxjQUFjO0FBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRWhCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsR0FBRyxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQyxDQUFDO0FBRUgsZ0JBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyJ9