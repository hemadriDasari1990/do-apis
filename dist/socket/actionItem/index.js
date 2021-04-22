"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actionItem_1 = require("../../controllers/actionItem");
function actionItem(io, socket) {
    socket.on("update-actionItem", async (payload) => {
        // const query: any = socket.handshake.query;
        const updated = await actionItem_1.updateActionItem(Object.assign({}, payload));
        io.emit(`update-actionItem-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, updated);
    });
    socket.on(`create-actionItem`, async (payload) => {
        // const query: any = socket.handshake.query;
        const created = await actionItem_1.updateActionItem(Object.assign({}, payload));
        if (created === null || created === void 0 ? void 0 : created._id) {
            io.emit(`plus-actionItem-count-response`, created);
        }
        io.emit(`create-actionItem-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, created);
    });
    socket.on("delete-actionItem", async (payload) => {
        const deleted = await actionItem_1.deleteActionItem(payload === null || payload === void 0 ? void 0 : payload.id, payload === null || payload === void 0 ? void 0 : payload.actionId);
        if (deleted === null || deleted === void 0 ? void 0 : deleted.deleted) {
            io.emit(`minus-actionItem-count-response`, deleted);
        }
        io.emit(`delete-actionItem-response-${payload === null || payload === void 0 ? void 0 : payload.sectionId}`, deleted);
    });
}
exports.default = actionItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb2NrZXQvYWN0aW9uSXRlbS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZEQUdzQztBQUd0QyxTQUF3QixVQUFVLENBQUMsRUFBbUIsRUFBRSxNQUFjO0lBQ3BFLE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUN2RSw2Q0FBNkM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsTUFBTSw2QkFBZ0IsbUJBQ2pDLE9BQU8sRUFFVixDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsT0FBK0IsRUFBRSxFQUFFO1FBQ3ZFLDZDQUE2QztRQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLDZCQUFnQixtQkFDakMsT0FBTyxFQUVWLENBQUM7UUFDSCxJQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLEVBQUU7WUFDaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNwRDtRQUNELEVBQUUsQ0FBQyxJQUFJLENBQUMsOEJBQThCLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxFQUFFLE9BQStCLEVBQUUsRUFBRTtRQUN2RSxNQUFNLE9BQU8sR0FBRyxNQUFNLDZCQUFnQixDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxFQUFFLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU8sRUFBRTtZQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsRUFBRSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTdCRCw2QkE2QkMifQ==