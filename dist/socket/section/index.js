"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const section_1 = require("../../controllers/section");
function section(io, socket) {
    socket.on("update-section", async (payload) => {
        var _a;
        try {
            console.log("socket", (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.query);
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const updated = await section_1.updateSection(Object.assign(Object.assign({}, payload), { user: util_1.decodeToken(query === null || query === void 0 ? void 0 : query.token) }));
            console.log("updated", updated);
            io.emit(`update-section-response`, updated);
        }
        catch (err) {
            throw err;
        }
    });
    socket.on("create-section", async (payload) => {
        var _a;
        try {
            console.log("socket12", (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.query);
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const created = await section_1.updateSection(Object.assign({}, payload));
            console.log("created", created);
            io.emit(`create-section-response`, created);
        }
        catch (err) {
            throw err;
        }
    });
    socket.on("delete-section", async (sectionId) => {
        try {
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const user = util_1.decodeToken(query === null || query === void 0 ? void 0 : query.token);
            const deleted = await section_1.deleteSection(sectionId, user === null || user === void 0 ? void 0 : user._id);
            io.emit(`delete-section-response`, deleted);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.default = section;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvc2VjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFzRDtBQUN0RCx1REFBeUU7QUFHekUsU0FBd0IsT0FBTyxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUNqRSxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7O1FBQ3BFLElBQUk7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsUUFBRSxNQUFNLENBQUMsU0FBUywwQ0FBRSxLQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMxQyxrQkFBVyxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUIsTUFBTSxPQUFPLEdBQUcsTUFBTSx1QkFBYSxpQ0FDOUIsT0FBTyxLQUNWLElBQUksRUFBRSxrQkFBVyxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLENBQUMsSUFDL0IsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sR0FBRyxDQUFDO1NBQ1g7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTs7UUFDcEUsSUFBSTtZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxRQUFFLE1BQU0sQ0FBQyxTQUFTLDBDQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pELE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxNQUFNLHVCQUFhLG1CQUM5QixPQUFPLEVBRVYsQ0FBQztZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sR0FBRyxDQUFDO1NBQ1g7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLFNBQWlCLEVBQUUsRUFBRTtRQUN0RCxJQUFJO1lBQ0YsTUFBTSxLQUFLLEdBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDMUMsa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxHQUFRLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFELEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sR0FBRyxDQUFDO1NBQ1g7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE1Q0QsMEJBNENDIn0=