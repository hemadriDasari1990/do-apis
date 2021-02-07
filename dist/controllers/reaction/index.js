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
        index_1.socket.emit("new-reaction", reactionCreated);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFDN0Msa0NBQTRDO0FBQzVDLHVDQUFxQztBQUU5QixLQUFLLFVBQVUsc0JBQXNCLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjs7SUFDMUYsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQztZQUM1QixNQUFNLFFBQUUsR0FBRyxDQUFDLElBQUksMENBQUUsTUFBTTtZQUN4QixJQUFJLFFBQUUsR0FBRyxDQUFDLElBQUksMENBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFDSCxNQUFNLGVBQWUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QyxJQUFHLENBQUMsZUFBZSxFQUFDO1lBQ2xCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUM1RDtRQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sd0JBQWlCLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLElBQUcsQ0FBQyxLQUFLLEVBQUM7WUFDUixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQjtRQUNELGNBQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDOUM7SUFBQyxPQUFNLEdBQUcsRUFBRTtRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNyQztBQUNILENBQUM7QUFuQkQsd0RBbUJDO0FBQUEsQ0FBQztBQUVLLEtBQUssVUFBVSw0QkFBNEIsQ0FBQyxNQUFjO0lBQy9ELElBQUk7UUFDRixNQUFNLGFBQWEsR0FBRyxNQUFNLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZELElBQUcsRUFBQyxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsTUFBTSxDQUFBLEVBQUM7WUFDeEIsT0FBTztTQUNSO1FBQ0QsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBcUIsRUFBRSxJQUEwQixFQUFFLEVBQUU7WUFDL0YsTUFBTSxPQUFPLENBQUM7WUFDZCxNQUFNLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sT0FBTyxDQUFDO0tBQ2hCO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDWCxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO0tBQzFCO0FBQ0gsQ0FBQztBQWRELG9FQWNDO0FBRUQsS0FBSyxVQUFVLGtCQUFrQixDQUFDLFVBQWtCO0lBQ2xELElBQUk7UUFDRixJQUFHLENBQUMsVUFBVSxFQUFDO1lBQ2IsT0FBTztTQUNSO1FBQ0QsT0FBTyxNQUFNLGtCQUFRLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDckQ7SUFBQyxPQUFNLEdBQUcsRUFBRTtRQUNYLE1BQU0sNkJBQTZCLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekQ7QUFDSCxDQUFDO0FBRUQsS0FBSyxVQUFVLGtCQUFrQixDQUFDLE1BQWM7SUFDOUMsSUFBSTtRQUNGLElBQUcsQ0FBQyxNQUFNLEVBQUM7WUFDVCxPQUFPO1NBQ1I7UUFDRCxPQUFPLE1BQU0sa0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ3hDO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDWCxNQUFNLDhCQUE4QixHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzFEO0FBQ0gsQ0FBQyJ9