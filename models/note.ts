import mongoose from "mongoose";

const Schema = mongoose.Schema;
const NoteSchema = new Schema(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    updatedById: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      default: null,
    },
    description: {
      type: String,
      trim: true,
      minlength: 5,
    },
    isAnnonymous: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: 0,
      index: true,
    },
    reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Member" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

// NoteSchema.index({ sectionId: 1, position: 1 }, { unique: true });

export default mongoose.model("Note", NoteSchema);
