"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = require("../../controllers/note");
const section_1 = require("../../controllers/section");
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
        const created = await note_1.markNoteRead(Object.assign({}, payload));
        io.emit(`mark-note-read-response-${created === null || created === void 0 ? void 0 : created.sectionId}`, created);
    });
    socket.on("update-note-position", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await note_1.updateNotePosition(Object.assign({}, payload));
        io.emit(`update-note-position-response`, updated);
    });
    socket.on("move-note-to-section", async (payload) => {
        const noteDetails = await section_1.addAndRemoveNoteFromSection(payload);
        io.emit(`move-note-to-source-section-response-${payload.sourceSectionId}`, payload.source);
        io.emit(`move-note-to-destination-section-response-${payload.destinationSectionId}`, noteDetails, payload.destination);
        io.emit(`minus-note-count-response`, {
            sectionId: payload.sourceSectionId,
        });
        io.emit(`plus-note-count-response`, {
            sectionId: payload.destinationSectionId,
        });
    });
}
exports.default = note;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbm90ZSBjb3B5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBS2dDO0FBRWhDLHVEQUF3RTtBQUN4RSw0Q0FBNEM7QUFFNUMsU0FBd0IsSUFBSSxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUM5RCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLG1CQUMzQixPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDakUsNkNBQTZDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQVUsbUJBQzNCLE9BQU8sRUFFVixDQUFDO1FBQ0gsSUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxFQUFFO1lBQ2hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDOUM7UUFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQVUsQ0FDOUIsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEVBQUUsRUFDWCxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsTUFBTSxFQUNmLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLENBQ25CLENBQUM7UUFDRixJQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxPQUFPLEVBQUU7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUMvQztRQUNELEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNwRSw2Q0FBNkM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBWSxtQkFDN0IsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDMUUsNkNBQTZDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0seUJBQWtCLG1CQUNuQyxPQUFPLEVBRVYsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsK0JBQStCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDMUUsTUFBTSxXQUFXLEdBQUcsTUFBTSxxQ0FBMkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvRCxFQUFFLENBQUMsSUFBSSxDQUNMLHdDQUF3QyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQ2pFLE9BQU8sQ0FBQyxNQUFNLENBQ2YsQ0FBQztRQUNGLEVBQUUsQ0FBQyxJQUFJLENBQ0wsNkNBQTZDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUMzRSxXQUFXLEVBQ1gsT0FBTyxDQUFDLFdBQVcsQ0FDcEIsQ0FBQztRQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUU7WUFDbkMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxlQUFlO1NBQ25DLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7WUFDbEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxvQkFBb0I7U0FDeEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBdEVELHVCQXNFQyJ9