import mongoose from "mongoose";

delete mongoose.connection.models["DefaultSection"];

const Schema = mongoose.Schema;
const DefaultSectionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

DefaultSectionSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("DefaultSection", DefaultSectionSchema);
