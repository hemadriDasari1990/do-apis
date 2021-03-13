import mongoose from "mongoose";

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Organizaton",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1hr" },
});

export default mongoose.model("Token", TokenSchema);
