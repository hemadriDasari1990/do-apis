import mongoose from "mongoose";

delete mongoose.connection.models["Join"];

const Schema = mongoose.Schema;
const JoinSchema = new Schema(
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
      lowercase: true,
    },
    avatarId: {
      type: Number,
      default: 0,
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

export default mongoose.model("JoinMember", JoinSchema);
