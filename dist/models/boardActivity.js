"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["BoardActivity"];
const Schema = mongoose_1.default.Schema;
const BoardActivitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: ["create", "update", "delete", "seccion-start", "seccion-stop"],
        default: "create",
        index: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("BoardActivity", BoardActivitySchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmRBY3Rpdml0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy9ib2FyZEFjdGl2aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBRWhDLE9BQU8sa0JBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRW5ELE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxNQUFNLENBQ3BDO0lBQ0UsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsTUFBTTtRQUNYLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQzNCLEdBQUcsRUFBRSxPQUFPO1FBQ1osS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDO1FBQ3JFLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLEtBQUssRUFBRSxJQUFJO0tBQ1o7Q0FDRixFQUNEO0lBQ0UsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FDRixDQUFDO0FBRUYsa0JBQWUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLG1CQUFtQixDQUFDLENBQUMifQ==