import mongoose from "mongoose";

delete mongoose.connection.models["Board"];

const Schema = mongoose.Schema;
const BoardSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
      required: true,
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
      minlength: 5,
    },
    sprint: {
      type: Number,
      default: 0,
    },
    isDefaultBoard: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "inprogress", "completed"],
      default: "draft",
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    inviteSent: {
      type: Boolean,
      default: false,
    },
    inviteCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    actionItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "ActionItem",
      },
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    joinedMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Join",
      },
    ],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

BoardSchema.index({ projectId: 1, name: 1 }, { unique: true });
BoardSchema.index({ projectId: 1, name: 1, sprint: 1 }, { unique: true });
// BoardSchema.index({ "$**": "text" }); // for full text search with $text operator
BoardSchema.index(
  { name: "text", sprint: "text" },
  { weights: { name: 1, sprint: 2 } }
);

export default mongoose.model("Board", BoardSchema);
