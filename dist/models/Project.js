"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["Project"];
const Schema = mongoose_1.default.Schema;
const ProjectSchema = new Schema({
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
        index: true,
    },
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "inactive"],
        default: "active",
        index: true,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    boards: [
        {
            type: Schema.Types.ObjectId,
            ref: "Board",
        },
    ],
}, {
    timestamps: true,
    strict: true,
});
ProjectSchema.index({ departmentId: 1, title: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Project", ProjectSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9wcm9qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE9BQU8sa0JBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTdDLE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sYUFBYSxHQUFHLElBQUksTUFBTSxDQUM5QjtJQUNFLFlBQVksRUFBRTtRQUNaLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLFlBQVk7UUFDakIsUUFBUSxFQUFFLElBQUk7UUFDZCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtLQUNiO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxFQUFFO0tBQ2Q7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztRQUM1QixPQUFPLEVBQUUsUUFBUTtRQUNqQixLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsTUFBTSxFQUFFO1FBQ047WUFDRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNCLEdBQUcsRUFBRSxPQUFPO1NBQ2I7S0FDRjtDQUNGLEVBQ0Q7SUFDRSxVQUFVLEVBQUUsSUFBSTtJQUNoQixNQUFNLEVBQUUsSUFBSTtDQUNiLENBQ0YsQ0FBQztBQUVGLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRXJFLGtCQUFlLGtCQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQyJ9