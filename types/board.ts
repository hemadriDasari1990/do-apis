import { Document } from "mongoose";
import { Section } from "./section";

export interface Board extends Document {
    title: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    sections?: Section[]
}