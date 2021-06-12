import mongoose from "mongoose";

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["confirm-email", "forgot-password", "confirm-email", "join-board"],
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1hr" },
});

TokenSchema.index({ email: 1, userId: 1, type: 1, token: 1 }, { unique: true });

export default mongoose.model("Token", TokenSchema);
