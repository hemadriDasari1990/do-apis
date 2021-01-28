import { Document } from "mongoose";
import { Section } from "./section";
export interface Board extends Document {
    _id: string;
    title: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    sections?: Section[];
}
