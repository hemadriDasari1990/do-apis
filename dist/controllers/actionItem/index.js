"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionItem = exports.findActionItemsByActionAndDelete = exports.updateActionItemActionId = exports.deleteActionItem = exports.getActionItemsByActionId = exports.updateActionItem = void 0;
const actionItemFilters_1 = require("../../util/actionItemFilters");
const actionItem_1 = __importDefault(require("../../models/actionItem"));
const action_1 = require("../action");
const mongoose_1 = __importDefault(require("mongoose"));
async function updateActionItem(payload) {
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload.noteId) }, update = {
            $set: {
                description: payload.description,
                actionId: payload.actionId,
                assignedById: payload.assignedById || null,
                assignedToId: payload.assignedToId || null,
                status: payload === null || payload === void 0 ? void 0 : payload.status,
                priority: payload === null || payload === void 0 ? void 0 : payload.priority,
                dueDate: payload === null || payload === void 0 ? void 0 : payload.dueDate,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updated = await actionItem_1.default.findOneAndUpdate(query, update, options);
        await action_1.addActionItemToAction(updated._id, payload.actionId);
        return updated;
    }
    catch (err) {
        return err || err.message;
    }
}
exports.updateActionItem = updateActionItem;
async function getActionItemsByActionId(req, res) {
    try {
        const query = { actionId: mongoose_1.default.Types.ObjectId(req.params.actionId) };
        const actionItems = await actionItem_1.default.aggregate([
            { $match: query },
            actionItemFilters_1.assignedByLookUp,
            {
                $unwind: {
                    path: "$assignedBy",
                    preserveNullAndEmptyArrays: true,
                },
            },
            actionItemFilters_1.assignedToLookUp,
            {
                $unwind: {
                    path: "$assignedTo",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        return res.status(200).json(actionItems);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getActionItemsByActionId = getActionItemsByActionId;
async function deleteActionItem(id, actionId) {
    try {
        const deleted = deleteActionItemById(id);
        if (!deleted) {
            return deleted;
        }
        return { deleted: true, _id: id, actionId };
    }
    catch (err) {
        return {
            deleted: false,
            message: err || (err === null || err === void 0 ? void 0 : err.message),
            _id: id,
            actionId,
        };
    }
}
exports.deleteActionItem = deleteActionItem;
async function updateActionItemActionId(actionItemId, actionId) {
    try {
        if (!actionItemId || !actionId) {
            return;
        }
        const updated = await actionItem_1.default.findByIdAndUpdate(actionItemId, {
            actionId: actionId,
        });
        return updated;
    }
    catch (err) {
        throw `Error while updating new action ${err || err.message}`;
    }
}
exports.updateActionItemActionId = updateActionItemActionId;
async function findActionItemsByActionAndDelete(sectionId) {
    try {
        const notesList = await getActionItemsByAction(sectionId);
        if (!(notesList === null || notesList === void 0 ? void 0 : notesList.length)) {
            return;
        }
        const deleted = notesList.reduce(async (promise, note) => {
            await promise;
            await deleteActionItemById(note._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findActionItemsByActionAndDelete = findActionItemsByActionAndDelete;
async function getActionItem(query) {
    try {
        const actionItem = await actionItem_1.default.findOne(query);
        return actionItem;
    }
    catch (err) {
        throw err | err.message;
    }
}
exports.getActionItem = getActionItem;
async function deleteActionItemById(actionItemId) {
    try {
        if (!actionItemId) {
            return;
        }
        return await actionItem_1.default.findByIdAndRemove(actionItemId);
    }
    catch (err) {
        throw `Error while deleting action item ${err || err.message}`;
    }
}
async function getActionItemsByAction(actionId) {
    try {
        if (!actionId) {
            return;
        }
        return await actionItem_1.default.find({ actionId });
    }
    catch (err) {
        throw `Error while fetching action items ${err || err.message}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hY3Rpb25JdGVtL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG9FQUdzQztBQUV0Qyx5RUFBaUQ7QUFDakQsc0NBQWtEO0FBRWxELHdEQUFnQztBQUV6QixLQUFLLFVBQVUsZ0JBQWdCLENBQUMsT0FFdEM7SUFDQyxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxHQUFHLEVBQUUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUM1RCxNQUFNLEdBQUc7WUFDUCxJQUFJLEVBQUU7Z0JBQ0osV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO2dCQUNoQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7Z0JBQzFCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxJQUFJLElBQUk7Z0JBQzFDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxJQUFJLElBQUk7Z0JBQzFDLE1BQU0sRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsTUFBTTtnQkFDdkIsUUFBUSxFQUFFLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxRQUFRO2dCQUMzQixPQUFPLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE9BQU87Z0JBQ3pCLE9BQU8sRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsT0FBTzthQUMxQjtTQUNGLEVBQ0QsT0FBTyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLElBQUksRUFBRSxDQUFDO1FBQ25FLE1BQU0sT0FBTyxHQUFRLE1BQU0sb0JBQVUsQ0FBQyxnQkFBZ0IsQ0FDcEQsS0FBSyxFQUNMLE1BQU0sRUFDTixPQUFPLENBQ1IsQ0FBQztRQUNGLE1BQU0s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