import { Document } from "mongoose";
import { Like } from "./like";

export interface Note extends Document {
    description: string;
    sectionId: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: Like[]
}