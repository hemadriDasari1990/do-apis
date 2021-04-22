"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["BoardActivity"];
const Schema = mongoose_1.default.Schema;
const ActivitySchema = new Schema({
    title: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        index: true,
        rquired: true,
    },
    type: {
        type: String,
        enum: [
            "board",
            "section",
            "note",
            "plusOne",
            "minusOne",
            "deserve",
            "love",
            "highlight",
            "visibility",
        ],
        index: true,
        required: true,
    },
    action: {
        type: String,
        required: true,
        enum: [
            "create",
            "update",
            "delete",
            "session-start",
            "session-stop",
            "read",
            "un-read",
            "react",
            "un-react",
            "move",
            "private",
            "public",
            "view",
        ],
        default: "create",
        index: true,
    },
    primaryAction: {
        type: String,
    },
    primaryTitle: {
        type: String,
    },
    secondaryAction: {
        type: String,
    },
    secondaryTitle: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Activity", ActivitySchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvYWN0aXZpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsT0FBTyxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFbkQsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQy9CO0lBQ0UsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07S0FDYjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLE1BQU07UUFDWCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsT0FBTztRQUNaLEtBQUssRUFBRSxJQUFJO1FBQ1gsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFO1lBQ0osT0FBTztZQUNQLFNBQVM7WUFDVCxNQUFNO1lBQ04sU0FBUztZQUNULFVBQVU7WUFDVixTQUFTO1lBQ1QsTUFBTTtZQUNOLFdBQVc7WUFDWCxZQUFZO1NBQ2I7UUFDRCxLQUFLLEVBQUUsSUFBSTtRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFO1lBQ0osUUFBUTtZQUNSLFFBQVE7WUFDUixRQUFRO1lBQ1IsZUFBZTtZQUNmLGNBQWM7WUFDZCxNQUFNO1lBQ04sU0FBUztZQUNULE9BQU87WUFDUCxVQUFVO1lBQ1YsTUFBTTtZQUNOLFNBQVM7WUFDVCxRQUFRO1lBQ1IsTUFBTTtTQUNQO1FBQ0QsT0FBTyxFQUFFLFFBQVE7UUFDakIsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELGFBQWEsRUFBRTtRQUNiLElBQUksRUFBRSxNQUFNO0tBQ2I7SUFDRCxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsTUFBTTtLQUNiO0lBQ0QsZUFBZSxFQUFFO1FBQ2YsSUFBSSxFQUFFLE1BQU07S0FDYjtJQUNELGNBQWMsRUFBRTtRQUNkLElBQUksRUFBRSxNQUFNO0tBQ2I7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQzNCLEdBQUcsRUFBRSxNQUFNO0tBQ1o7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQzNCLEdBQUcsRUFBRSxPQUFPO0tBQ2I7Q0FDRixFQUNEO0lBQ0UsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FDRixDQUFDO0FBRUYsa0JBQWUsa0JBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDIn0=