"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const department_1 = require("../../controllers/department");
function department(io, socket) {
    socket.on("get-departments", async (userId) => {
        const departments = await department_1.getDepartments(userId);
        io.emit("get-departments-response", departments);
    });
}
exports.default = department;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvZGVwYXJ0bWVudC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDZEQUE4RDtBQUU5RCxTQUF3QixVQUFVLENBQUMsRUFBbUIsRUFBRSxNQUFjO0lBQ3BFLE1BQU0sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQWMsRUFBRSxFQUFFO1FBQ3BELE1BQU0sV0FBVyxHQUFHLE1BQU0sMkJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUxELDZCQUtDIn0=