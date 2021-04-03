import UserInstance from "../types/user";
import bcrypt from "bcrypt";
import config from "config";
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 1,
      required: true,
    },
    email: {
      type: String,
      // min: [5, "Too short, min is 5 characters"],
      // max: [32, "Too long, max is 32 characters"],
      unique: true,
      lowercase: true,
      // required: "Email is required",
    },
    password: {
      type: String,
      min: [5, "Too short, min is 5 characters"],
      max: [32, "Too long, max is 32 characters"],
      required: "Password is required",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    isAgreed: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["commercial", "individual"],
      default: "commercial",
      index: true,
    },
    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    boards: [
      {
        type: Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

// UserSchema.statics.EncryptPassword = async function(password) {
//   const hash = await bcrypt.hash(password, 12);
//   return hash;
// };

UserSchema.pre<UserInstance>("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(
    this.password,
    Number(config.get("bcryptSalt"))
  );
  this.password = hash;
  next();
});

export default mongoose.model("User", UserSchema);
