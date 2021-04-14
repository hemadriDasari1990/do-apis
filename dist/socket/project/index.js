"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../../controllers/project");
// import { decodeToken } from "../../util";
function project(io, socket) {
    socket.on("get-projects", async (userId) => {
        const projects = await project_1.getProjectsByUser(userId);
        io.emit(`get-projects-response`, projects);
    });
}
exports.default = project;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvcHJvamVjdC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHVEQUE4RDtBQUU5RCw0Q0FBNEM7QUFFNUMsU0FBd0IsT0FBTyxDQUFDLEVBQW1CLEVBQUUsTUFBYztJQUNqRSxNQUFNLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBYyxFQUFFLEVBQUU7UUFDakQsTUFBTSxRQUFRLEdBQUcsTUFBTSwyQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUxELDBCQUtDIn0=