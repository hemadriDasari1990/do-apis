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
    },
    title: {
      type: String,
      trim: true,
      minlength: 1,
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
      enum: ["pending", "inprogress", "completed"],
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
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

BoardSchema.index({ projectId: 1, title: 1 }, { unique: true });
BoardSchema.index({ projectId: 1, title: 1, sprint: 1 }, { unique: true });
// BoardSchema.index({ "$**": "text" }); // for full text search with $text operator
BoardSchema.index(
  { title: "text", sprint: "text" },
  { weights: { title: 1, sprint: 2 } }
);

export default mongoose.model("Board", BoardSchema);
