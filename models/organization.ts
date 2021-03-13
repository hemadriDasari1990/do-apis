import OrganizationInstance from "../types/organization";
import bcrypt from "bcrypt";
import config from "config";
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const OrganizationSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 1,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: 10,
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
    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

// OrganizationSchema.statics.EncryptPassword = async function(password) {
//   const hash = await bcrypt.hash(password, 12);
//   return hash;
// };

OrganizationSchema.pre<OrganizationInstance>("save", async function(next) {
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

export default mongoose.model("Organization", OrganizationSchema);
