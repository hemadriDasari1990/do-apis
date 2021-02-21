import { Document } from "mongoose";

export interface Like extends Document {
    noteId: string;
    createdAt?: Date;
    updatedAt?: Date;
}