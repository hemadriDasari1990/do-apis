import mongoose from "mongoose";

delete mongoose.connection.models["Project"];

const Schema = mongoose.Schema;
const ProjectSchema = new Schema(
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
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: 10,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    boards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    strict: true,
  }
);

ProjectSchema.index({ userId: 1, name: 1 }, { unique: true });
ProjectSchema.index({ name: "text" });
export default mongoose.model("Project", ProjectSchema);
