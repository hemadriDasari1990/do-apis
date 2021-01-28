import { Document } from "mongoose";
import { Note } from "./note";
export interface Section extends Document {
    _id: string;
    title: string;
    boardId: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: Note[];
}
