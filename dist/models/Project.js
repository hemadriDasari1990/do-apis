"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models['Project'];
const Schema = mongoose_1.default.Schema;
const ProjectSchema = new Schema({
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
        required: true
    },
    boards: [{
            type: Schema.Types.ObjectId, ref: 'Board'
        }],
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
ProjectSchema.index({ departmentId: 1, title: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Project', ProjectSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9Qcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE9BQU8sa0JBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTdDLE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQy9CLFlBQVksRUFBRTtRQUNaLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLFlBQVk7UUFDakIsUUFBUSxFQUFFLElBQUk7UUFDZCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsRUFBRTtRQUNiLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxNQUFNLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsT0FBTztTQUMxQyxDQUFDO0NBQ0gsRUFDQztJQUNFLFVBQVUsRUFBRSxJQUFJLENBQUMsMkVBQTJFO0NBQy9GLENBQUMsQ0FBQztBQUVILGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBRWpFLGtCQUFlLGtCQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQyJ9