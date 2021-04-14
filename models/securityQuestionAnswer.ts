import mongoose from "mongoose";

delete mongoose.connection.models["SecurityQuestionAnswer"];

const Schema = mongoose.Schema;
const SecurityQuestionAnswerSchema = new Schema(
  {
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
    answered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

SecurityQuestionAnswerSchema.index(
  { userId: 1, questionId: 1, value: 1 },
  { unique: true }
);
export default mongoose.model(
  "SecurityQuestionAnswer",
  SecurityQuestionAnswerSchema
);
