// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Recommendation Schema
//= ===============================
const RecommendationSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    joinedMemberId: {
      type: Schema.Types.ObjectId,
      ref: "JoinMember",
      index: true,
    },
    joinedMember: {
      type: Schema.Types.ObjectId,
      ref: "JoinMember",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recommendation", RecommendationSchema);
