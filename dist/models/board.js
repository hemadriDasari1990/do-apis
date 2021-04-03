"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["Board"];
const Schema = mongoose_1.default.Schema;
const BoardSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        default: null,
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    },
    title: {
        type: String,
        trim: true,
        minlength: 1,
    },
    description: {
        type: String,
        trim: true,
        minlength: 5,
    },
    sprint: {
        type: Number,
        default: 0,
    },
    isSystemName: {
        type: Boolean,
        default: false,
    },
    isDefaultBoard: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        required: true,
        enum: ["draft", "pending", "inprogress", "completed"],
        default: "draft",
        index: true,
    },
    startedAt: {
        type: Date,
        default: null,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    inviteSent: {
        type: Boolean,
        default: false,
    },
    inviteCount: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    sections: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
    teams: [
        {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
}, {
    timestamps: true,
});
BoardSchema.index({ projectId: 1, title: 1 }, { unique: true });
BoardSchema.index({ projectId: 1, title: 1, sprint: 1 }, { unique: true });
BoardSchema.index({ userId: 1, title: 1 }, { unique: true });
BoardSchema.index({ userId: 1, title: 1, sprint: 1 }, { unique: true });
BoardSchema.index({ title: "text" });
exports.default = mongoose_1.default.model("Board", BoardSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsT0FBTyxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQzVCO0lBQ0UsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsU0FBUztRQUNkLE9BQU8sRUFBRSxJQUFJO1FBQ2IsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLE1BQU07UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLENBQUM7S0FDYjtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsQ0FBQztLQUNiO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsWUFBWSxFQUFFO1FBQ1osSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU07UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBQztRQUNyRCxPQUFPLEVBQUUsT0FBTztRQUNoQixLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsSUFBSTtLQUNkO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsSUFBSTtLQUNkO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsUUFBUSxFQUFFO1FBQ1I7WUFDRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNCLEdBQUcsRUFBRSxTQUFTO1NBQ2Y7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNMO1lBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMzQixHQUFHLEVBQUUsTUFBTTtTQUNaO0tBQ0Y7Q0FDRixFQUNEO0lBQ0UsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FDRixDQUFDO0FBRUYsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEUsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzRSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM3RCxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUVyQyxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMifQ==