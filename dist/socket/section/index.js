"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const section_1 = require("../../controllers/section");
function section(io, socket) {
    socket.on("update-section", async (payload) => {
        try {
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const updated = await section_1.updateSection(Object.assign(Object.assign({}, payload), { user: util_1.decodeToken(query === null || query === void 0 ? void 0 : query.token) }));
            io.emit(`update-section-response`, updated);
        }
        catch (err) {
            return err;
        }
    });
    socket.on("create-section", async (payload) => {
        try {
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const created = await section_1.updateSection(Object.assign({}, payload));
            io.emit(`create-section-response`, created);
        }
        catch (err) {
            return err;
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
            return err;
        }
    });
}
exports.default = section;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvc2VjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFzRDtBQUN0RCx1REFBeUU7QUFHekUsU0FBd0IsT0FBTyxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUNqRSxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDcEUsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxNQUFNLHVCQUFhLGlDQUM5QixPQUFPLEtBQ1YsSUFBSSxFQUFFLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssQ0FBQyxJQUMvQixDQUFDO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM3QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxHQUFHLENBQUM7U0FDWjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ3BFLElBQUk7WUFDRixNQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMxQyxrQkFBVyxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUIsTUFBTSxPQUFPLEdBQUcsTUFBTSx1QkFBYSxtQkFDOUIsT0FBTyxFQUVWLENBQUM7WUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxTQUFpQixFQUFFLEVBQUU7UUFDdEQsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixNQUFNLElBQUksR0FBUSxrQkFBVyxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLENBQUMsQ0FBQztZQUM1QyxNQUFNLE9BQU8sR0FBRyxNQUFNLHVCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxHQUFHLENBQUMsQ0FBQztZQUMxRCxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBeENELDBCQXdDQyJ9