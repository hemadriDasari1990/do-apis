"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("../../controllers/board");
const util_1 = require("../../util");
const board_2 = require("../../controllers/board");
// import { decodeToken } from "../../util";
function board(io, socket) {
    socket.on("start-session", async (payload) => {
        try {
            const query = socket.handshake.query;
            await util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const updated = await board_1.startOrCompleteBoard(Object.assign({}, payload));
            io.emit(`start-session-response`, updated);
        }
        catch (err) {
            return err;
        }
    });
    socket.on("end-session", async (payload) => {
        try {
            const query = socket.handshake.query;
            await util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const updated = await board_1.startOrCompleteBoard(Object.assign({}, payload));
            io.emit(`end-session-response`, updated);
        }
        catch (err) {
            return err;
        }
    });
    socket.on("change-visibility", async (payload) => {
        try {
            const query = socket.handshake.query;
            await util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const updated = await board_1.changeVisibility(Object.assign({}, payload));
            io.emit(`change-visibility-response`, updated);
        }
        catch (err) {
            return err;
        }
    });
    socket.on("invite-member-to-board", async (payload) => {
        try {
            const query = socket.handshake.query;
            await util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const user = util_1.decodeToken(query === null || query === void 0 ? void 0 : query.token);
            const sent = await board_2.inviteMemberToBoard(Object.assign(Object.assign({}, payload), { user }));
            await io.emit(`invite-member-to-board-response`, sent);
        }
        catch (err) {
            return err;
        }
    });
}
exports.default = board;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvYm9hcmQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFHaUM7QUFDakMscUNBQXNEO0FBR3RELG1EQUE4RDtBQUU5RCw0Q0FBNEM7QUFFNUMsU0FBd0IsS0FBSyxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUMvRCxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ25FLElBQUk7WUFDRixNQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMxQyxNQUFNLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLDRCQUFvQixtQkFDckMsT0FBTyxFQUNWLENBQUM7WUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzVDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ2pFLElBQUk7WUFDRixNQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMxQyxNQUFNLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLDRCQUFvQixtQkFDckMsT0FBTyxFQUNWLENBQUM7WUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzFDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDdkUsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLE1BQU0sa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sT0FBTyxHQUFHLE1BQU0sd0JBQWdCLG1CQUNqQyxPQUFPLEVBQ1YsQ0FBQztZQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDaEQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sR0FBRyxDQUFDO1NBQ1o7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQ1Asd0JBQXdCLEVBQ3hCLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDeEMsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLE1BQU0sa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sSUFBSSxHQUFRLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVDLE1BQU0sSUFBSSxHQUFHLE1BQU0sMkJBQW1CLGlDQUFNLE9BQU8sS0FBRSxJQUFJLElBQUcsQ0FBQztZQUM3RCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDeEQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sR0FBRyxDQUFDO1NBQ1o7SUFDSCxDQUFDLENBQ0YsQ0FBQztBQUNKLENBQUM7QUFyREQsd0JBcURDIn0=