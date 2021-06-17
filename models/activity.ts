import mongoose from "mongoose";

delete mongoose.connection.models["BoardActivity"];

const Schema = mongoose.Schema;
const ActivitySchema = new Schema(
  {
    message: {
      type: String,
      allowNull: false,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "JoinMember",
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
        "visibility",
        "invite",
        "agree",
        "highlight",
        "disagree",
        "love",
        "deserve",
        "join",
      ],
      index: true,
      required: true,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "JoinMember",
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
