import { Document } from "mongoose";
export interface Like extends Document {
    _id: string;
    noteId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
