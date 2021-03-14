"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const section_1 = require("../controllers/section");
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
    });
}
exports.default = socketEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxvREFBcUU7QUFFckUsU0FBd0IsWUFBWSxDQUFDLEVBQW1CO0lBQ3RELDJCQUEyQjtJQUMzQixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRTtRQUM3QywrQ0FBK0M7UUFDL0Msc0NBQXNDO1FBQ3RDLE1BQU07UUFDTixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7WUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsSUFBNEIsRUFBRSxFQUFFO1lBQ3ZFLE1BQU0sT0FBTyxHQUFHLE1BQU0scUNBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWZELCtCQWVDIn0=