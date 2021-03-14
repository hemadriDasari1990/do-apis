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
            type: (_b = req.body) === null || _b === void 0 ? void 0 : _b.type,
        });
        const reactionCreated = await reaction.save();
        if (!reactionCreated) {
            return res.status(500).send("Resource creation is failed");
        }
        const added = await note_1.addReactionToNote(reactionCreated._id, req.body.noteId);
        if (!added) {
            return next(added);
        }
        index_1.socket.emit(`new-reaction-${added === null || added === void 0 ? void 0 : added._id}`, reactionCreated);
        return res.status(200).send(reactionCreated);
    }
    catch (err) {
        throw new Error(err || err.message);
    }
}
exports.createOrUpdateReaction = createOrUpdateReaction;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb250cm9sbGVycy9yZWFjdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNkM7QUFDN0Msa0NBQTRDO0FBQzVDLHVDQUFxQztBQUU5QixLQUFLLFVBQVUsc0JBQXNCLENBQzFDLEdBQVksRUFDWixHQUFhLEVBQ2IsSUFBa0I7O0lBRWxCLElBQUk7UUFDRixNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQUM7WUFDNUIsTUFBTSxRQUFFLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLE1BQU07WUFDeEIsSUFBSSxRQUFFLEdBQUcsQ0FBQyxJQUFJLDBDQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxlQUFlLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNwQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDNUQ7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLHdCQUFpQixDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7UUFDRCxjQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDM0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUM5QztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQztBQXZCRCx3REF1QkM7QUFFTSxLQUFLLFVBQVUsNEJBQTRCLENBQ2hELE1BQWM7SUFFZCxJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2RCxJQUFJLEVBQUMsYUFBYSxhQUFiLGFBQWEsdUJBQWIsYUFBYSxDQUFFLE1BQU0sQ0FBQSxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUNELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQ2xDLEtBQUssRUFBRSxPQUFxQixFQUFFLElBQTRCLEVBQUUsRUFBRTtZQUM1RCxNQUFNLE9BQU8sQ0FBQztZQUNkLE1BQU0sa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFDRCxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUNwQixDQUFDO1FBQ0YsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDMUI7QUFDSCxDQUFDO0FBbkJELG9FQW1CQztBQUVELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxVQUFrQjtJQUNsRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE9BQU87U0FDUjtRQUNELE9BQU8sTUFBTSxrQkFBUSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3JEO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixNQUFNLDZCQUE2QixHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pEO0FBQ0gsQ0FBQztBQUVELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxNQUFjO0lBQzlDLElBQUk7UUFDRixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBQ0QsT0FBTyxNQUFNLGtCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUN4QztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osTUFBTSw4QkFBOEIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUMxRDtBQUNILENBQUMifQ==