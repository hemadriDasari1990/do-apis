"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const member_1 = require("../../controllers/member");
function member(io, socket) {
    socket.on("search-members", async (queryString) => {
        const members = await member_1.searchMembers(queryString);
        io.emit(`search-members-response`, members);
    });
}
exports.default = member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvbWVtYmVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscURBQXlEO0FBRXpELFNBQXdCLE1BQU0sQ0FBQyxFQUFtQixFQUFFLE1BQWM7SUFDaEUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsV0FBbUIsRUFBRSxFQUFFO1FBQ3hELE1BQU0sT0FBTyxHQUFHLE1BQU0sc0JBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUxELHlCQUtDIn0=