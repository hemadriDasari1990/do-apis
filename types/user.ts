import { Document } from "mongoose";

export default interface UserInstance extends Document {
  name: string;
  description: string;
  email: string;
  password: string;
  isActive: boolean;
  emailVerified: boolean;
  token: string;
}
