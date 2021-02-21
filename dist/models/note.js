"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const NoteSchema = new Schema({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
        minlength: 5
    },
    read: {
        type: Boolean,
        default: false
    },
    reactions: [
        { type: Schema.Types.ObjectId, ref: 'Reaction' }
    ]
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
exports.default = mongoose_1.default.model('Note', NoteSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9ub3RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQzVCLFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLFNBQVM7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLENBQUM7S0FDYjtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELFNBQVMsRUFBRztRQUNWLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUU7S0FDakQ7Q0FDRixFQUNDO0lBQ0UsVUFBVSxFQUFFLElBQUksQ0FBQywyRUFBMkU7Q0FDL0YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDIn0=