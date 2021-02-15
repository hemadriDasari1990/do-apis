"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReactionsByNoteAndDelete = exports.createOrUpdateReaction = void 0;
const reaction_1 = __importDefault(require("../../models/reaction"));
const note_1 = require("../note");
const index_1 = require("../../index");
async function createOrUpdateReaction(req, res, next) {
    var _a, _b;
    try {
        const reaction = new reaction_1.default({
            noteId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.noteId,
            type: (_b = req.body) === null || _b === void 0 ? void 0 : _b.type
        });
        const reactionCreated = await reaction.save();
        if (!reactionCreated) {
            return res.status(500).send("Resource creation is failed");
        }
        const added = await note_1.addReactionToNote(reactionCreated._id, req.body.noteId);
        if (!added) {
            return next(added);
        }
        index_1.socket.emit(`new-reaction-${added === null || added === void 0 ? void 0 : added.sectionId}`, reactionCreated);
        return res.status(200).send(reactionCreated);
    }
    catch (err) {
        throw new Error(err || err.message);
    }
}
exports.createOrUpdateReaction = createOrUpdateReaction;
;
async function findReactionsByNoteAndDelete(noteId) {
    try {
        const reactionsList = await getReactionsByNote(noteId);
        if (!(reactionsList === null || reactionsList === void 0 ? void 0 : reactionsList.length)) {
            return;
        }
        const deleted = reactionsList.reduce(async (promise, note) => {
            await promise;
            await deleteReactionById(note._id);
        }, [Promise.resolve()]);
        return deleted;
    }
    catch (err) {
        throw err || err.message;
    }
}
exports.findReactionsByNoteAndDelete = findReactionsByNoteAndDelete;
async function deleteReactionById(reactionId) {
    try {
        if (!reactionId) {
            return;
        }
        return await reaction_1.default.findByIdAndRemove(reactionId);
    }
    catch (err) {
        throw `Error while deleting note ${err || err.message}`;
    }
}
async function getReactionsByNote(noteId) {
    try {
        if (!noteId) {
            return;
        }
        return await reaction_1.default.find({ noteId });
    }
    catch (err) {
        throw `Error while fetching notes ${err || err.message}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFDN0Msa0NBQTRDO0FBQzVDLHVDQUFxQztBQUU5QixLQUFLLFVBQVUsc0JBQXNCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7SUFDMUYsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQztZQUM1QixNQUFNLFFBQUUsR0FBRyxDQUFDLElBQUksMENBQUUsTUFBTTtZQUN4QixJQUFJLFFBQUUsR0FBRyxDQUFDLElBQUksMENBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFDSCxNQUFNLGVBQWUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QyxJQUFHLENBQUMsZUFBZSxFQUFDO1lBQ2xCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUM1RDtRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sd0JBQWlCLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLElBQUcsQ0FBQyxLQUFLLEVBQUM7WUFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQjtRQUNELGNBQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxTQUFTLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNqRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzlDO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckM7QUFDSCxDQUFDO0FBbkJELHdEQW1CQztBQUFBLENBQUM7QUFFSyxLQUFLLFVBQVUsNEJBQTRCLENBQUMsTUFBYztJQUMvRCxJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFHLEVBQUMsYUFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLE1BQU0sQ0FBQSxFQUFDO1lBQ3hCLE9BQU87U0FDUjtRQUNELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQXFCLEVBQUUsSUFBMEIsRUFBRSxFQUFFO1lBQy9GLE1BQU0sT0FBTyxDQUFDO1lBQ2QsTUFBTSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUFDLE9BQU0sR0FBRyxFQUFFO1FBQ1gsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQztLQUMxQjtBQUNILENBQUM7QUFkRCxvRUFjQztBQUVELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxVQUFrQjtJQUNsRCxJQUFJO1FBQ0YsSUFBRyxDQUFDLFVBQVUsRUFBQztZQUNiLE9BQU87U0FDUjtRQUNELE9BQU8sTUFBTSxrQkFBUSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3JEO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDWCxNQUFNLDZCQUE2QixHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pEO0FBQ0gsQ0FBQztBQUVELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxNQUFjO0lBQzlDLElBQUk7UUFDRixJQUFHLENBQUMsTUFBTSxFQUFDO1lBQ1QsT0FBTztTQUNSO1FBQ0QsT0FBTyxNQUFNLGtCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUN4QztJQUFDLE9BQU0sR0FBRyxFQUFFO1FBQ1gsTUFBTSw4QkFBOEIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMxRDtBQUNILENBQUMifQ==