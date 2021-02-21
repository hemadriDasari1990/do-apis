"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const OrganizationSchema = new Schema({
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
    uniqueKey: {
        type: String,
        trim: true,
        minlength: 5,
        unique: true,
        index: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
    },
    departments: [{
            type: Schema.Types.ObjectId, ref: 'Department'
        }],
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
exports.default = mongoose_1.default.model('Organization', OrganizationSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL29yZ2FuaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFnQztBQUVoQyxNQUFNLE1BQU0sR0FBRyxrQkFBUSxDQUFDLE1BQU0sQ0FBQztBQUMvQixNQUFNLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDO0lBQ3BDLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsQ0FBQztRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLEVBQUU7UUFDYixRQUFRLEVBQUUsSUFBSTtLQUNmO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osTUFBTSxFQUFFLElBQUk7UUFDWixLQUFLLEVBQUUsSUFBSTtRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtLQUNiO0lBQ0QsV0FBVyxFQUFFLENBQUM7WUFDWixJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVk7U0FDL0MsQ0FBQztDQUNILEVBQ0M7SUFDRSxVQUFVLEVBQUUsSUFBSSxDQUFDLDJFQUEyRTtDQUMvRixDQUFDLENBQUM7QUFFSCxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyJ9