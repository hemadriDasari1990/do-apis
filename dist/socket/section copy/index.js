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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvc2VjdGlvbiBjb3B5L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXNEO0FBQ3RELHVEQUF5RTtBQUd6RSxTQUF3QixPQUFPLENBQUMsRUFBbUIsRUFBRSxNQUFjO0lBQ2pFLE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNwRSxJQUFJO1lBQ0YsTUFBTSxLQUFLLEdBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDMUMsa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQWEsaUNBQzlCLE9BQU8sS0FDVixJQUFJLEVBQUUsa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxDQUFDLElBQy9CLENBQUM7WUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzdDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDcEUsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxNQUFNLHVCQUFhLG1CQUM5QixPQUFPLEVBRVYsQ0FBQztZQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sR0FBRyxDQUFDO1NBQ1o7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLFNBQWlCLEVBQUUsRUFBRTtRQUN0RCxJQUFJO1lBQ0YsTUFBTSxLQUFLLEdBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDMUMsa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxHQUFRLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLE1BQU0sT0FBTyxHQUFHLE1BQU0sdUJBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzFELEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sR0FBRyxDQUFDO1NBQ1o7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF4Q0QsMEJBd0NDIn0=