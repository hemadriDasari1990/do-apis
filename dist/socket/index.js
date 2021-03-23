"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../controllers/section");
const department_1 = require("../controllers/department");
function socketEvents(io) {
    // Set socket.io listeners.
    io.sockets.on("connection", (socket) => {
        // socket.on('typing', (sectionId: string) => {
        //   socket.emit('typing', sectionId);
        // });
        socket.on("disconnect", () => {
            console.log("socket disconnected");
        });
        socket.on("move-note-to-section", async (body) => {
            const updated = await section_1.addAndRemoveNoteFromSection(body);
            socket.emit("move-note-to-section", updated);
        });
        socket.on("get-departments", async (userId) => {
            const departments = await department_1.getDepartments(userId);
            socket.emit("get-departmentsn", departments);
        });
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxvREFBcUU7QUFDckUsMERBQTJEO0FBRTNELFNBQXdCLFlBQVksQ0FBQyxFQUFtQjtJQUN0RCwyQkFBMkI7SUFDM0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUU7UUFDN0MsK0NBQStDO1FBQy9DLHNDQUFzQztRQUN0QyxNQUFNO1FBQ04sTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLElBQTRCLEVBQUUsRUFBRTtZQUN2RSxNQUFNLE9BQU8sR0FBRyxNQUFNLHFDQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxNQUFjLEVBQUUsRUFBRTtZQUNwRCxNQUFNLFdBQVcsR0FBRyxNQUFNLDJCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXBCRCwrQkFvQkMifQ==