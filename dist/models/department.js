"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models['Department'];
const Schema = mongoose_1.default.Schema;
const DepartmentSchema = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
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
    projects: [{
            type: Schema.Types.ObjectId, ref: 'Project'
        }],
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
DepartmentSchema.index({ organizationId: 1, title: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Department', DepartmentSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVwYXJ0bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9EZXBhcnRtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE9BQU8sa0JBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRWhELE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUM7SUFDaEMsY0FBYyxFQUFFO1FBQ2hCLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLGNBQWM7UUFDbkIsUUFBUSxFQUFFLElBQUk7UUFDZCxLQUFLLEVBQUUsSUFBSTtLQUNWO0lBQ0gsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsRUFBRTtRQUNiLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxRQUFRLEVBQUUsQ0FBQztZQUNULElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsU0FBUztTQUM1QyxDQUFDO0NBQ0gsRUFDQztJQUNFLFVBQVUsRUFBRSxJQUFJLENBQUMsMkVBQTJFO0NBQy9GLENBQUMsQ0FBQztBQUVILGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7QUFFdEUsa0JBQWUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUMifQ==