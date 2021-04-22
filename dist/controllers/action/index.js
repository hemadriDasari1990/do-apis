"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addActionItemToAction = exports.findActionsByBoardAndDelete = exports.removeActionItemFromAction = exports.deleteAction = exports.getActionByBoardId = exports.getAction = exports.updateAction = exports.saveSection = void 0;
const actionItemFilters_1 = require("../../util/actionItemFilters");
const constants_1 = require("../../util/constants");
const action_1 = __importDefault(require("../../models/action"));
const mongoose_1 = __importDefault(require("mongoose"));
const actionItem_1 = require("../actionItem");
async function saveSection(input) {
    try {
        if (!input) {
            return;
        }
        const action = new action_1.default(input);
        return await action.save();
    }
    catch (err) {
        throw err;
    }
}
exports.saveSection = saveSection;
async function updateAction(payload) {
    var _a;
    try {
        const query = { _id: mongoose_1.default.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.actionId) }, update = {
            $set: {
                title: payload === null || payload === void 0 ? void 0 : payload.title,
                boardId: payload === null || payload === void 0 ? void 0 : payload.boardId,
            },
        }, options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const action = await getAction({
            $and: [{ title: (_a = payload === null || payload === void 0 ? void 0 : payload.title) === null || _a === void 0 ? void 0 : _a.trim() }, { boardId: payload === null || payload === void 0 ? void 0 : payload.boardId }],
        });
        if (action) {
            return {
                errorId: constants_1.RESOURCE_ALREADY_EXISTS,
                message: `Action with ${action === null || action === void 0 ? void 0 : action.title} already exist. Please choose different name`,
            };
        }
        const updated = await action_1.default.findOneAndUpdate(query, update, options);
        return updated;
    }
    catch (err) {
        return err;
    }
}
exports.updateAction = updateAction;
async function getAction(query) {
    try {
        const actions = await action_1.default.aggregate([
            { $match: query },
            actionItemFilters_1.actionItemsLookup,
            actionItemFilters_1.actionItemAddFields,
        ]);
        return actions ? actions[0] : null;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.getAction = getAction;
async function getActionByBoardId(req, res) {
    try {
        const action = await getAction({
            boardId: mongoose_1.default.Types.ObjectId(req.params.boardId),
        });
        return res.status(200).json(action);
    }
    catch (err) {
        return res.status(500).send(err || err.message);
    }
}
exports.getActionByBoardId = getActionByBoardId;
async function deleteAction(actionId) {
    try {
        const deleted = deleteActionAndActionItems(actionId);
        if (!deleted) {
            return deleted;
        }
        return { deleted: true, _id: actionId };
    }
    catch (err) {
        return {
            deleted: false,
            message: err || (err === null || err === void 0 ? void 0 : err.message),
            _id: actionId,
        };
    }
}
exports.deleteAction = deleteAction;
async function deleteActionAndActionItems(actionId) {
    try {
        await actionItem_1.findActionItemsByActionAndDelete(actionId);
        const deleted = await action_1.default.findByIdAndRemove(actionId);
        return deleted;
    }
    catch (err) {
        throw `Error while deleting action and action items associated ${err ||
            err.message}`;
    }
}
async function removeActionItemFromAction(actionItemId, actionId) {
    try {
        if (!actionItemId || !actionId) {
            return;
        }
        const updated = await action_1.default.findByIdAndUpdate(actionId, { $pull: { notes: actionItemId } }
        // { new: true, useFindAndModify: false }
        );
        return updated;
    }
    catch (err) {
        throw `Error while removing action item from action ${err || err.message}`;
    }
}
exports.removeActionItemFromAction = removeActionItemFromAction;
async function findActionsByBoardAndDelete(boardId) {
    try {
        const action = await getAction({
            boardId: mongoose_1.default.Types.ObjectId(boardId),
        });
        if (!action) {
            return;
        }
        const deleted = await deleteAction(action._id);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findActionsByBoardAndDelete = findActionsByBoardAndDelete;
async function addActionItemToAction(actionItemId, actionId) {
    try {
        if (!actionItemId || !actionId) {
            return;
        }
        const updated = await action_1.default.findByIdAndUpdate(actionId, { $push: { notes: actionItemId } }, { new: true, useFindAndModify: false });
        return updated;
    }
    catch (err) {
        throw `Error while adding action item to action ${err || err.message}`;
    }
}
exports.addActionItemToAction = addActionItemToAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9hY3Rpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0VBR3NDO0FBRXRDLG9EQUErRDtBQUMvRCxpRUFBeUM7QUFFekMsd0RBQWdDO0FBQ2hDLDhDQUFpRTtBQUUxRCxLQUFLLFVBQVUsV0FBVyxDQUFDLEtBQVU7SUFDMUMsSUFBSTtRQUNGLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPO1NBQ1I7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsT0FBTyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM1QjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxHQUFHLENBQUM7S0FDWDtBQUNILENBQUM7QUFWRCxrQ0FVQztBQUVNLEtBQUssVUFBVSxZQUFZLENBQUMsT0FFbEM7O0lBQ0MsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsUUFBUSxDQUFDLEVBQUUsRUFDL0QsTUFBTSxHQUFHO1lBQ1AsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSztnQkFDckIsT0FBTyxFQUFFLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxPQUFPO2FBQzFCO1NBQ0YsRUFDRCxPQUFPLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDbkUsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUM7WUFDN0IsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLFFBQUUsT0FB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