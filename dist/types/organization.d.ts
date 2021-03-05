import { Document } from "mongoose";
export default interface OrganizationInstance extends Document {
    title: string;
    description: string;
    email: string;
    password: string;
    isActive: boolean;
    emailVerified: boolean;
    token: string;
    departments?: Array<{
        [Key: string]: any;
    }>;
}
