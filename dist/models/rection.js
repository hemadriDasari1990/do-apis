"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ReactionSchema = new Schema({
    noteId: {
        type: Schema.Types.ObjectId,
        ref: 'Note',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['agree', 'disagree', 'love'],
        default: 'agree',
        index: true
    },
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
exports.default = mongoose_1.default.model('Reaction', ReactionSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9yZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDO0lBQ2hDLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLE1BQU07UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFHLENBQUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7UUFDbkMsT0FBTyxFQUFFLE9BQU87UUFDaEIsS0FBSyxFQUFFLElBQUk7S0FDWjtDQUNGLEVBQ0M7SUFDRSxVQUFVLEVBQUUsSUFBSSxDQUFDLDJFQUEyRTtDQUMvRixDQUFDLENBQUM7QUFFSCxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUMifQ==