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
        const deleted = await note_1.deleteNote(payload);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbm90ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUtnQztBQUdoQyx1REFBd0U7QUFFeEUsNENBQTRDO0FBRTVDLFNBQXdCLElBQUksQ0FBQyxFQUFtQixFQUFFLE1BQWM7SUFDOUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNqRSw2Q0FBNkM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsTUFBTSxpQkFBVSxtQkFDM0IsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLG1CQUMzQixPQUFPLEVBRVYsQ0FBQztRQUNILElBQUksT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEdBQUcsRUFBRTtZQUNoQixFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNqRSxNQUFNLE9BQU8sR0FBRyxNQUFNLGlCQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsSUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsT0FBTyxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDL0M7UUFDRCxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsU0FBUyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDcEUsNkNBQTZDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0sbUJBQVksbUJBQzdCLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQywyQkFBMkIsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQzFFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLHlCQUFrQixtQkFDbkMsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQzFFLE1BQU0sV0FBVyxHQUFHLE1BQU0scUNBQTJCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsRUFBRSxDQUFDLElBQUksQ0FDTCx3Q0FBd0MsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUNqRSxPQUFPLENBQUMsTUFBTSxDQUNmLENBQUM7UUFDRixFQUFFLENBQUMsSUFBSSxDQUNMLDZDQUE2QyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFDM0UsV0FBVyxFQUNYLE9BQU8sQ0FBQyxXQUFXLENBQ3BCLENBQUM7UUFDRixFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQ25DLFNBQVMsRUFBRSxPQUFPLENBQUMsZUFBZTtTQUNuQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ2xDLFNBQVMsRUFBRSxPQUFPLENBQUMsb0JBQW9CO1NBQ3hDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWxFRCx1QkFrRUMifQ==