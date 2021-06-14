import mongoose from "mongoose";

const Schema = mongoose.Schema;
const JoinTokenSchema = new Schema({
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    index: true,
    required: true,
  },
  memberId: {
    type: Schema.Types.ObjectId,
    ref: "Member",
    index: true,
    required: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "2hr" },
});

JoinTokenSchema.index({ email: 1, memberId: 1, token: 1 }, { unique: true });

export default mongoose.model("JoinToken", JoinTokenSchema);
