import mongoose from "mongoose";

delete mongoose.connection.models["NoteActivity"];

const Schema = mongoose.Schema;
const NoteActivitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "move", "read", "un-read"],
      default: "create",
      index: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("NoteActivity", NoteActivitySchema);
