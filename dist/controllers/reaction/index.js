"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReactionsByNoteAndDelete = exports.createOrUpdateReaction = void 0;
const reaction_1 = __importDefault(require("../../models/reaction"));
const note_1 = require("../note");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFDN0Msa0NBQTRDO0FBRXJDLEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCOztJQUMxRixJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDO1lBQzVCLE1BQU0sUUFBRSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxNQUFNO1lBQ3hCLElBQUksUUFBRSxHQUFHLENBQUMsSUFBSSwwQ0FBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUNILE1BQU0sZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUcsQ0FBQyxlQUFlLEVBQUM7WUFDbEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSx3QkFBaUIsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUUsSUFBRyxDQUFDLEtBQUssRUFBQztZQUNSLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BCO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUM5QztJQUFDLE9BQU0sR0FBRyxFQUFFO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQWxCRCx3REFrQkM7QUFBQSxDQUFDO0FBRUssS0FBSyxVQUFVLDRCQUE0QixDQUFDLE1BQWM7SUFDL0QsSUFBSTtRQUNGLE1BQU0sYUFBYSxHQUFHLE1BQU0sa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsSUFBRyxFQUFDLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxNQUFNLENBQUEsRUFBQztZQUN4QixPQUFPO1NBQ1I7UUFDRCxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFxQixFQUFFLElBQTBCLEVBQUUsRUFBRTtZQUMvRixNQUFNLE9BQU8sQ0FBQztZQUNkLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFBQyxPQUFNLEdBQUcsRUFBRTtRQUNYLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDMUI7QUFDSCxDQUFDO0FBZEQsb0VBY0M7QUFFRCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsVUFBa0I7SUFDbEQsSUFBSTtRQUNGLElBQUcsQ0FBQyxVQUFVLEVBQUM7WUFDYixPQUFPO1NBQ1I7UUFDRCxPQUFPLE1BQU0sa0JBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNyRDtJQUFDLE9BQU0sR0FBRyxFQUFFO1FBQ1gsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6RDtBQUNILENBQUM7QUFFRCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsTUFBYztJQUM5QyxJQUFJO1FBQ0YsSUFBRyxDQUFDLE1BQU0sRUFBQztZQUNULE9BQU87U0FDUjtRQUNELE9BQU8sTUFBTSxrQkFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDeEM7SUFBQyxPQUFNLEdBQUcsRUFBRTtRQUNYLE1BQU0sOEJBQThCLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDMUQ7QUFDSCxDQUFDIn0=