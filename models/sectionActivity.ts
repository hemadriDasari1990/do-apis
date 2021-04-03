import mongoose from "mongoose";

delete mongoose.connection.models["SectionActivity"];

const Schema = mongoose.Schema;
const SectionActivitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "move"],
      default: "create",
      index: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("SectionActivity", SectionActivitySchema);
