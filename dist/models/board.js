"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models['Board'];
const Schema = mongoose_1.default.Schema;
const BoardSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    title: {
        type: String,
        trim: true,
        minlength: 1
    },
    description: {
        type: String,
        trim: true,
        minlength: 5
    },
    sprint: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    sections: [{
            type: Schema.Types.ObjectId, ref: 'Section'
        }],
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
BoardSchema.index({ projectId: 1, title: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Board', BoardSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvQm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsT0FBTyxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFM0MsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUM7SUFDN0IsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsU0FBUztRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsQ0FBQztLQUNiO0lBQ0QsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO0tBQ2I7SUFDRCxNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtLQUNiO0lBQ0QsUUFBUSxFQUFFLENBQUM7WUFDVCxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFNBQVM7U0FDNUMsQ0FBQztDQUNILEVBQ0M7SUFDRSxVQUFVLEVBQUUsSUFBSSxDQUFDLDJFQUEyRTtDQUMvRixDQUFDLENBQUM7QUFFSCxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUU1RCxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMifQ==