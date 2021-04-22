import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ActionItemSchema = new Schema(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: 5,
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      index: true,
      default: null,
    },
    assignedById: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      index: true,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "inprogress", "blocked", "completed"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "high", "medium"],
      default: "low",
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    assignedBy: { type: Schema.Types.ObjectId, ref: "Member" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

export default mongoose.model("ActionItem", ActionItemSchema);
