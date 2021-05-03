import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SectionSchema = new Schema(
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
    notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("Section", SectionSchema);
