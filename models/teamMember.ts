import mongoose from "mongoose";

delete mongoose.connection.models["TeamMember"];

const Schema = mongoose.Schema;
const TeamMemberSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "Mmeber",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

TeamMemberSchema.index({ member: 1, team: 1 }, { unique: true });

export default mongoose.model("TeamMember", TeamMemberSchema);
