"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("../../controllers/member");
const util_1 = require("../../util");
function member(io, socket) {
    socket.on("search-members", async (queryString) => {
        const query = socket.handshake.query;
        await util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
        const members = await member_1.searchMembers(queryString);
        io.emit(`search-members-response`, members);
    });
}
exports.default = member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbWVtYmVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscURBQXlEO0FBQ3pELHFDQUF5QztBQUV6QyxTQUF3QixNQUFNLENBQUMsRUFBbUIsRUFBRSxNQUFjO0lBQ2hFLE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLFdBQW1CLEVBQUUsRUFBRTtRQUN4RCxNQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLHNCQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakQsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFQRCx5QkFPQyJ9