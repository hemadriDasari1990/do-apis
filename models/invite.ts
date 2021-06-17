import mongoose from "mongoose";

delete mongoose.connection.models["Board"];

const Schema = mongoose.Schema;
const InviteSchema = new Schema(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      index: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: 1,
    },
    email: {
      type: String,
      // min: [5, "Too short, min is 5 characters"],
      // max: [32, "Too long, max is 32 characters"],
      unique: true,
      lowercase: true,
      required: true,
    },
    avatarId: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
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

InviteSchema.index({ email: 1, boardId: 1 }, { unique: true });

export default mongoose.model("InviteMember", InviteSchema);
