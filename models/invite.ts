import mongoose from "mongoose";

delete mongoose.connection.models["Board"];

const Schema = mongoose.Schema;
const InviteSchema = new Schema(
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
      default: 0,
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

export default mongoose.model("Invite", InviteSchema);
