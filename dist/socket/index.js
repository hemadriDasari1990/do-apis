"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function socketEvents(io) {
    // Set socket.io listeners.
    io.sockets.on('connection', (socket) => {
        // socket.on('typing', (sectionId: string) => {
        //   socket.emit('typing', sectionId);
        // });
        socket.on('disconnect', () => {
            console.log("socket discenncted");
        });
    });
}
exports.default = socketEvents;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb2NrZXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxTQUF3QixZQUFZLENBQUMsRUFBbUI7SUFDcEQsMkJBQTJCO0lBQzNCLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQzdDLCtDQUErQztRQUMvQyxzQ0FBc0M7UUFDdEMsTUFBTTtRQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFWSCwrQkFVRztBQUFBLENBQUMifQ==