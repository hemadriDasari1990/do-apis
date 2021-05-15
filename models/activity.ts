import mongoose from "mongoose";

delete mongoose.connection.models["BoardActivity"];

const Schema = mongoose.Schema;
const ActivitySchema = new Schema(
  {
    title: {
      type: String,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      index: true,
      rquired: true,
    },
    type: {
      type: String,
      enum: [
        "board",
        "section",
        "note",
        "plusOne",
        "minusOne",
        "deserve",
        "love",
        "highlight",
        "visibility",
      ],
      index: true,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "delete",
        "session-start",
        "session-stop",
        "read",
        "un-read",
        "react",
        "un-react",
        "move",
        "private",
        "public",
        "view",
      ],
      default: "create",
      index: true,
    },
    primaryAction: {
      type: String,
    },
    primaryTitle: {
      type: String,
    },
    secondaryAction: {
      type: String,
    },
    secondaryTitle: {
      type: String,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "member",
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("Activity", ActivitySchema);
