import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ActionSchema = new Schema(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: 1,
    },
    actionItems: [{ type: Schema.Types.ObjectId, ref: "ActionItem" }],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("Action", ActionSchema);
