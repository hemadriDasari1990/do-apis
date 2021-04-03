import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ReactionSchema = new Schema(
  {
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["plusOne", "plusTwo", "minusOne", "love", "deserve"],
      default: "agree",
      index: true,
    },
    reactedBy: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("Reaction", ReactionSchema);
