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
    socket.on("delete-note", async (id) => {
        const deleted = await note_1.deleteNote(id);
        io.emit(`delete-note-response-${id}`, deleted);
    });
    socket.on("mark-note-read", async (payload) => {
        // const query: any = socket.handshake.query;
        const create = await note_1.markNoteRead(Object.assign({}, payload));
        io.emit(`mark-note-read-response-${payload === null || payload === void 0 ? void 0 : payload.id}`, create);
    });
}
exports.default = note;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbm90ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGlEQUE4RTtBQUM5RSw0Q0FBNEM7QUFFNUMsU0FBd0IsSUFBSSxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUM5RCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLG1CQUMzQixPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDakUsNkNBQTZDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLE1BQU0saUJBQVUsbUJBQzFCLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQVUsRUFBRSxFQUFFO1FBQzVDLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNwRSw2Q0FBNkM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxtQkFBWSxtQkFDNUIsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBaENELHVCQWdDQyJ9