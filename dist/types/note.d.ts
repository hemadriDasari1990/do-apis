import { Document } from "mongoose";
import { Like } from "./like";
export interface Note extends Document {
    _id: string;
    description: string;
    sectionId: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: Like[];
}
