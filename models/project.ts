import mongoose from "mongoose";

delete mongoose.connection.models["Project"];

const Schema = mongoose.Schema;
const ProjectSchema = new Schema(
  {
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    title: {
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
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    strict: true,
  }
);

ProjectSchema.index({ departmentId: 1, title: 1 }, { unique: true });

export default mongoose.model("Project", ProjectSchema);
