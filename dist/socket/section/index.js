"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../../controllers/section");
// import { decodeToken } from "../../util";
function section(io, socket) {
    socket.on("update-section", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await section_1.updateSection(Object.assign({}, payload));
        io.emit(`update-section-response`, updated);
    });
    socket.on("create-section", async (payload) => {
        // const query: any = socket.handshake.query;
        const create = await section_1.updateSection(Object.assign({}, payload));
        io.emit(`create-section-response`, create);
    });
    socket.on("delete-section", async (sectionId) => {
        const deleted = await section_1.deleteSection(sectionId);
        io.emit(`delete-section-response`, deleted);
    });
}
exports.default = section;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvc2VjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHVEQUF5RTtBQUN6RSw0Q0FBNEM7QUFFNUMsU0FBd0IsT0FBTyxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUNqRSxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDcEUsNkNBQTZDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQWEsbUJBQzlCLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNwRSw2Q0FBNkM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsTUFBTSx1QkFBYSxtQkFDN0IsT0FBTyxFQUVWLENBQUM7UUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsU0FBaUIsRUFBRSxFQUFFO1FBQ3RELE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXZCRCwwQkF1QkMifQ==