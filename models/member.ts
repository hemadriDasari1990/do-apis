import mongoose from "mongoose";

delete mongoose.connection.models["Member"];

const Schema = mongoose.Schema;
const MemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: 1,
      required: true,
    },
    email: {
      type: String,
      // min: [5, "Too short, min is 5 characters"],
      // max: [32, "Too long, max is 32 characters"],
      unique: true,
      lowercase: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAuthor: {
      type: Boolean,
      default: false,
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "TeamMember",
      },
    ],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

MemberSchema.index({ userId: 1, email: 1 }, { unique: true });
MemberSchema.index(
  { name: "text", email: "text" },
  { weights: { name: 1, email: 2 } }
);
export default mongoose.model("Member", MemberSchema);
