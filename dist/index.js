"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
const server_1 = __importDefault(require("./server"));
const config_1 = __importDefault(require("config"));
const http_1 = require("http");
const socket_1 = __importDefault(require("./socket"));
const io = require("socket.io");
const app = new server_1.default().bootstrap();
const server = http_1.createServer(app);
server.listen(config_1.default.get("port"));
server.on('listening', onListening);
server.on('error', onError);
function onListening() {
    console.log('🚀  server listening on port:', config_1.default.get("port"));
}
function onError(error) {
    console.log('There was an error:', error);
}
app.get("/", (req, res) => {
    console.log(req);
    res.send(`This is a landing page for letsdoretro service`);
});
// socket.io handlers
let socket = io(server, {
    // enable cors
    origins: '*:*'
});
exports.socket = socket;
// io.set('origins', '*:*')
socket_1.default(socket);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxzREFBeUM7QUFDekMsb0RBQTRCO0FBQzVCLCtCQUFvQztBQUNwQyxzREFBb0M7QUFFcEMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQWlCLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNoRCxNQUFNLE1BQU0sR0FBRyxtQkFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNsQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU1QixTQUFTLFdBQVc7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFVO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixHQUFHLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7QUFDL0QsQ0FBQyxDQUFDLENBQUM7QUFFSCxxQkFBcUI7QUFDckIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRTtJQUN0QixjQUFjO0lBQ2QsT0FBTyxFQUFFLEtBQUs7Q0FDZixDQUFDLENBQUE7QUFJTyx3QkFBTTtBQUhmLDJCQUEyQjtBQUMzQixnQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDIn0=