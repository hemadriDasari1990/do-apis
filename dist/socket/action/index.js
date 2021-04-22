"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const action_1 = require("../../controllers/action");
function action(io, socket) {
    socket.on("update-action", async (payload) => {
        try {
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const updated = await action_1.updateAction(Object.assign(Object.assign({}, payload), { user: util_1.decodeToken(query === null || query === void 0 ? void 0 : query.token) }));
            io.emit(`update-action-response`, updated);
        }
        catch (err) {
            return err;
        }
    });
    socket.on("create-action", async (payload) => {
        try {
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const created = await action_1.updateAction(Object.assign({}, payload));
            io.emit(`create-action-response`, created);
            io.emit(`action-created`, created);
        }
        catch (err) {
            return err;
        }
    });
    socket.on("delete-action", async (actionId) => {
        try {
            const query = socket.handshake.query;
            util_1.verifyToken(query === null || query === void 0 ? void 0 : query.token, io);
            const deleted = await action_1.deleteAction(actionId);
            io.emit(`delete-action-response`, deleted);
        }
        catch (err) {
            return err;
        }
    });
}
exports.default = action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvYWN0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXNEO0FBQ3RELHFEQUFzRTtBQUd0RSxTQUF3QixNQUFNLENBQUMsRUFBbUIsRUFBRSxNQUFjO0lBQ2hFLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxPQUErQixFQUFFLEVBQUU7UUFDbkUsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzFDLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QixNQUFNLE9BQU8sR0FBRyxNQUFNLHFCQUFZLGlDQUM3QixPQUFPLEtBQ1YsSUFBSSxFQUFFLGtCQUFXLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEtBQUssQ0FBQyxJQUMvQixDQUFDO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM1QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxHQUFHLENBQUM7U0FDWjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUNuRSxJQUFJO1lBQ0YsTUFBTSxLQUFLLEdBQVEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDMUMsa0JBQVcsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sT0FBTyxHQUFHLE1BQU0scUJBQVksbUJBQzdCLE9BQU8sRUFDVixDQUFDO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3BDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO1FBQ3BELElBQUk7WUFDRixNQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMxQyxrQkFBVyxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUIsTUFBTSxPQUFPLEdBQUcsTUFBTSxxQkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sR0FBRyxDQUFDO1NBQ1o7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF2Q0QseUJBdUNDIn0=