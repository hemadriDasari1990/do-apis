"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["NoteActivity"];
const Schema = mongoose_1.default.Schema;
const NoteActivitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    noteId: {
        type: Schema.Types.ObjectId,
        ref: "Note",
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: ["create", "update", "delete", "move", "read", "un-read"],
        default: "create",
        index: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("NoteActivity", NoteActivitySchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZUFjdGl2aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL25vdGVBY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFnQztBQUVoQyxPQUFPLGtCQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUVsRCxNQUFNLE1BQU0sR0FBRyxrQkFBUSxDQUFDLE1BQU0sQ0FBQztBQUMvQixNQUFNLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUNuQztJQUNFLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLE1BQU07UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsTUFBTTtRQUNYLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7UUFDL0QsT0FBTyxFQUFFLFFBQVE7UUFDakIsS0FBSyxFQUFFLElBQUk7S0FDWjtDQUNGLEVBQ0Q7SUFDRSxVQUFVLEVBQUUsSUFBSTtDQUNqQixDQUNGLENBQUM7QUFFRixrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyJ9