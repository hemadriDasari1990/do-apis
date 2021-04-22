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
    isDefaultBoard: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        required: true,
        enum: ["new", "inprogress", "completed"],
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
    isPrivate: {
        type: Boolean,
        default: true,
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
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
    },
    sections: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section",
        },
    ],
    actionItems: [
        {
            type: Schema.Types.ObjectId,
            ref: "ActionItem",
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
// BoardSchema.index({ "$**": "text" }); // for full text search with $text operator
BoardSchema.index({ title: "text", sprint: "text" }, { weights: { title: 1, sprint: 2 } });
exports.default = mongoose_1.default.model("Board", BoardSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsT0FBTyxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQzVCO0lBQ0UsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsU0FBUztRQUNkLE9BQU8sRUFBRSxJQUFJO1FBQ2IsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsQ0FBQztLQUNiO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO0tBQ2I7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUM7UUFDeEMsT0FBTyxFQUFFLE9BQU87UUFDaEIsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLFNBQVM7S0FDZjtJQUNELFFBQVEsRUFBRTtRQUNSO1lBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMzQixHQUFHLEVBQUUsU0FBUztTQUNmO0tBQ0Y7SUFDRCxXQUFXLEVBQUU7UUFDWDtZQUNFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDM0IsR0FBRyxFQUFFLFlBQVk7U0FDbEI7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNMO1lBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMzQixHQUFHLEVBQUUsTUFBTTtTQUNaO0tBQ0Y7Q0FDRixFQUNEO0lBQ0UsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FDRixDQUFDO0FBRUYsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEUsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMzRSxvRkFBb0Y7QUFDcEYsV0FBVyxDQUFDLEtBQUssQ0FDZixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUNqQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQ3JDLENBQUM7QUFFRixrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMifQ==