import { Document } from "mongoose";
import { Section } from "./section";

export interface Board extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sections?: Section[];
}
