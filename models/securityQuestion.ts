import mongoose from "mongoose";

delete mongoose.connection.models["SecurityQuestion"];

const Schema = mongoose.Schema;
const SecurityQuestionSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      index: true,
      required: true,
      minlength: 20,
      unique: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

SecurityQuestionSchema.index({ title: 1 }, { unique: true });

export default mongoose.model("SecurityQuestion", SecurityQuestionSchema);
