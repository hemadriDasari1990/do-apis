import mongoose from "mongoose";

delete mongoose.connection.models["Join"];

const Schema = mongoose.Schema;
const JoinSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      index: true,
      required: true,
    },
    guestName: {
      type: String,
    },
    avatarId: {
      type: Number,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("Join", JoinSchema);
