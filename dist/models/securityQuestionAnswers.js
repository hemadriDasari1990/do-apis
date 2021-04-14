"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["SecurityQuestionAnswer"];
const Schema = mongoose_1.default.Schema;
const SecurityQuestionAnswersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "SecurityQuestion",
        required: true,
        index: true,
    },
    value: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
SecurityQuestionAnswersSchema.index({ userId: 1, questionId: 1, value: 1 }, { unique: true });
exports.default = mongoose_1.default.model("SecurityQuestionAnswer", SecurityQuestionAnswersSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHlRdWVzdGlvbkFuc3dlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvc2VjdXJpdHlRdWVzdGlvbkFuc3dlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsT0FBTyxrQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUU1RCxNQUFNLE1BQU0sR0FBRyxrQkFBUSxDQUFDLE1BQU0sQ0FBQztBQUMvQixNQUFNLDZCQUE2QixHQUFHLElBQUksTUFBTSxDQUM5QztJQUNFLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7UUFDM0IsR0FBRyxFQUFFLE1BQU07UUFDWCxRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQzNCLEdBQUcsRUFBRSxrQkFBa0I7UUFDdkIsUUFBUSxFQUFFLElBQUk7UUFDZCxLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLElBQUk7S0FDYjtDQUNGLEVBQ0Q7SUFDRSxVQUFVLEVBQUUsSUFBSTtDQUNqQixDQUNGLENBQUM7QUFFRiw2QkFBNkIsQ0FBQyxLQUFLLENBQ2pDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFDdEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQ2pCLENBQUM7QUFDRixrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FDM0Isd0JBQXdCLEVBQ3hCLDZCQUE2QixDQUM5QixDQUFDIn0=