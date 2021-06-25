import mongoose from "mongoose";

delete mongoose.connection.models["SecurityQuestion"];

const Schema = mongoose.Schema;
const SecurityQuestionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
      minlength: 20,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

SecurityQuestionSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("SecurityQuestion", SecurityQuestionSchema);
