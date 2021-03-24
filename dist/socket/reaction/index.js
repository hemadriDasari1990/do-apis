"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reaction_1 = require("../../controllers/reaction");
// import { decodeToken } from "../../util";
function reaction(io, socket) {
    socket.on("add-reaction", async (payload) => {
        // const query: any = socket.handshake.query;
        const reactionUpdated = await reaction_1.createOrUpdateReaction(Object.assign({}, payload));
        io.emit(`add-reaction-response-${payload === null || payload === void 0 ? void 0 : payload.noteId}`, reactionUpdated);
    });
}
exports.default = reaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvcmVhY3Rpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5REFBb0U7QUFDcEUsNENBQTRDO0FBRTVDLFNBQXdCLFFBQVEsQ0FBQyxFQUFtQixFQUFFLE1BQWM7SUFDbEUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNsRSw2Q0FBNkM7UUFDN0MsTUFBTSxlQUFlLEdBQUcsTUFBTSxpQ0FBc0IsbUJBQy9DLE9BQU8sRUFFVixDQUFDO1FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE1BQU0sRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVZELDJCQVVDIn0=