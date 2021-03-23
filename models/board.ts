import mongoose from "mongoose";

delete mongoose.connection.models["Board"];

const Schema = mongoose.Schema;
const BoardSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
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
      unique: true,
    },
    isSystemName: {
      type: Boolean,
      default: false,
    },
    isDefaultBoard: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "pending", "inprogress", "completed"],
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
BoardSchema.index({ title: 1, sprint: 1 }, { unique: true });

export default mongoose.model("Board", BoardSchema);
