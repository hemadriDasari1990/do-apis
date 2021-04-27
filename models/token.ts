import mongoose from "mongoose";

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Member",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1hr" },
});

export default mongoose.model("Token", TokenSchema);
