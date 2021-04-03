import mongoose from "mongoose";

delete mongoose.connection.models["BoardActivity"];

const Schema = mongoose.Schema;
const BoardActivitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "seccion-start", "seccion-stop"],
      default: "create",
      index: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("BoardActivity", BoardActivitySchema);
