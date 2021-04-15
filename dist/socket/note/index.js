"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = require("../../controllers/note");
// import { decodeToken } from "../../util";
function note(io, socket) {
    socket.on("update-note", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await note_1.updateNote(Object.assign({}, payload));
        io.emit(`update-note-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, updated);
    });
    socket.on(`create-note`, async (payload) => {
        // const query: any = socket.handshake.query;
        const created = await note_1.updateNote(Object.assign({}, payload));
        if (created === null || created === void 0 ? void 0 : created._id) {
            io.emit(`plus-note-count-response`, created);
        }
        io.emit(`create-note-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, created);
    });
    socket.on("delete-note", async (payload) => {
        const deleted = await note_1.deleteNote(payload === null || payload === void 0 ? void 0 : payload.id, payload === null || payload === void 0 ? void 0 : payload.userId, payload === null || payload === void 0 ? void 0 : payload.sectionId);
        if (deleted === null || deleted === void 0 ? void 0 : deleted.deleted) {
            io.emit(`minus-note-count-response`, deleted);
        }
        io.emit(`delete-note-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, deleted);
    });
    socket.on("mark-note-read", async (payload) => {
        // const query: any = socket.handshake.query;
        const create = await note_1.markNoteRead(Object.assign({}, payload));
        io.emit(`mark-note-read-response`, create);
    });
    socket.on("update-note-position", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await note_1.updateNotePosition(Object.assign({}, payload));
        io.emit(`update-note-position-response`, updated);
    });
}
exports.default = note;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbm90ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUtnQztBQUdoQyw0Q0FBNEM7QUFFNUMsU0FBd0IsSUFBSSxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUM5RCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLG1CQUMzQixPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDakUsNkNBQTZDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQVUsbUJBQzNCLE9BQU8sRUFFVixDQUFDO1FBQ0gsSUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDOUM7UUFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQVUsQ0FDOUIsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEVBQUUsRUFDWCxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsTUFBTSxFQUNmLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLENBQ25CLENBQUM7UUFDRixJQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxPQUFPLEVBQUU7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMvQztRQUNELEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNwRSw2Q0FBNkM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxtQkFBWSxtQkFDNUIsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQzFFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLHlCQUFrQixtQkFDbkMsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQW5ERCx1QkFtREMifQ==