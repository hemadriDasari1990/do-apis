import mongoose from "mongoose";

delete mongoose.connection.models["Team"];

const Schema = mongoose.Schema;
const TeamSchema = new Schema(
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
    description: {
      type: String,
      trim: true,
      minlength: 10,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    members: [
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

TeamSchema.index({ userId: 1, name: 1 }, { unique: true });
TeamSchema.index({ name: "text" });

export default mongoose.model("Team", TeamSchema);
