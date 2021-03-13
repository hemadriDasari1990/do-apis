"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["Department"];
const Schema = mongoose_1.default.Schema;
const DepartmentSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
    },
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
        required: true,
    },
    status: {
        type: String,
        required: true,
        // enum: ["active", "inactive"],
        default: "active",
        index: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
}, {
    timestamps: true,
});
DepartmentSchema.index({ organizationId: 1, title: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Department", DepartmentSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwYXJ0bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9kZXBhcnRtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE9BQU8sa0JBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRWhELE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQ2pDO0lBQ0UsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsY0FBYztRQUNuQixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLENBQUM7UUFDWixRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxFQUFFO1FBQ2IsUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxnQ0FBZ0M7UUFDaEMsT0FBTyxFQUFFLFFBQVE7UUFDakIsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELFFBQVEsRUFBRTtRQUNSO1lBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMzQixHQUFHLEVBQUUsU0FBUztTQUNmO0tBQ0Y7Q0FDRixFQUNEO0lBQ0UsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FDRixDQUFDO0FBRUYsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUUxRSxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyJ9