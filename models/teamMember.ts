import mongoose from "mongoose";

delete mongoose.connection.models["TeamMember"];

const Schema = mongoose.Schema;
const TeamMemberSchema = new Schema(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Mmeber",
      required: true,
      index: true,
    },
    team: { type: Schema.Types.ObjectId, ref: "Member" },
    member: { type: Schema.Types.ObjectId, ref: "Member" },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

TeamMemberSchema.index({ memberId: 1, teamId: 1 }, { unique: true });

export default mongoose.model("TeamMember", TeamMemberSchema);
