"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = require("../../controllers/note");
// import { decodeToken } from "../../util";
function note(io, socket) {
    socket.on("update-note", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await note_1.updateNote(Object.assign({}, payload));
        io.emit(`update-note-response-${updated === null || updated === void 0 ? void 0 : updated._id}`, updated);
    });
    socket.on("create-note", async (payload) => {
        // const query: any = socket.handshake.query;
        const create = await note_1.updateNote(Object.assign({}, payload));
        io.emit(`create-note-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, create);
    });
    socket.on("delete-note", async (payload) => {
        const deleted = await note_1.deleteNote(payload === null || payload === void 0 ? void 0 : payload.id, payload === null || payload === void 0 ? void 0 : payload.userId);
        io.emit(`delete-note-response-${payload === null || payload === void 0 ? void 0 : payload.id}`, deleted);
    });
    socket.on("mark-note-read", async (payload) => {
        // const query: any = socket.handshake.query;
        const create = await note_1.markNoteRead(Object.assign({}, payload));
        io.emit(`mark-note-read-response-${payload === null || payload === void 0 ? void 0 : payload.id}`, create);
    });
    socket.on("update-note-position", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await note_1.updateNotePosition(Object.assign({}, payload));
        io.emit(`update-note-position-response`, updated);
    });
}
exports.default = note;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbm90ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUtnQztBQUdoQyw0Q0FBNEM7QUFFNUMsU0FBd0IsSUFBSSxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUM5RCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLG1CQUMzQixPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDakUsNkNBQTZDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLE1BQU0saUJBQVUsbUJBQzFCLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNqRSxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLENBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEVBQUUsRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0QsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ3BFLDZDQUE2QztRQUM3QyxNQUFNLE1BQU0sR0FBRyxNQUFNLG1CQUFZLG1CQUM1QixPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUMxRSw2Q0FBNkM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsTUFBTSx5QkFBa0IsbUJBQ25DLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF6Q0QsdUJBeUNDIn0=