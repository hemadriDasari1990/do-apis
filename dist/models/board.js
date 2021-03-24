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
        required: true,
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
exports.default = mongoose_1.default.model("Board", BoardSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsT0FBTyxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQzVCO0lBQ0UsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsU0FBUztRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsQ0FBQztLQUNiO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO0tBQ2I7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxjQUFjLEVBQUU7UUFDZCxJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDO1FBQ3JELE9BQU8sRUFBRSxPQUFPO1FBQ2hCLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsSUFBSTtRQUNWLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsSUFBSTtRQUNWLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxRQUFRLEVBQUU7UUFDUjtZQUNFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDM0IsR0FBRyxFQUFFLFNBQVM7U0FDZjtLQUNGO0lBQ0QsS0FBSyxFQUFFO1FBQ0w7WUFDRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNCLEdBQUcsRUFBRSxNQUFNO1NBQ1o7S0FDRjtDQUNGLEVBQ0Q7SUFDRSxVQUFVLEVBQUUsSUFBSTtDQUNqQixDQUNGLENBQUM7QUFFRixXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNoRSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRTNFLGtCQUFlLGtCQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyJ9