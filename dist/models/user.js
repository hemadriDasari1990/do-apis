"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 1,
        required: true,
    },
    email: {
        type: String,
        // min: [5, "Too short, min is 5 characters"],
        // max: [32, "Too long, max is 32 characters"],
        unique: true,
        lowercase: true,
    },
    newEmail: {
        type: String,
        // min: [5, "Too short, min is 5 characters"],
        // max: [32, "Too long, max is 32 characters"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        min: [5, "Too short, min is 5 characters"],
        max: [32, "Too long, max is 32 characters"],
        required: "Password is required",
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
    },
    isAgreed: {
        type: Boolean,
        default: false,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["commercial", "individual"],
        default: "individual",
        index: true,
    },
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
    teams: [
        {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "Member",
        },
    ],
}, {
    timestamps: true,
});
// UserSchema.statics.EncryptPassword = async function(password) {
//   const hash = await bcrypt.hash(password, 12);
//   return hash;
// };
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt_1.default.hash(this.password, Number(config_1.default.get("bcryptSalt")));
    this.password = hash;
    next();
});
UserSchema.index({ email: 1 }, { unique: true });
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1Qix3REFBZ0M7QUFFaEMsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQzNCO0lBQ0UsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO1FBQ1osOENBQThDO1FBQzlDLCtDQUErQztRQUMvQyxNQUFNLEVBQUUsSUFBSTtRQUNaLFNBQVMsRUFBRSxJQUFJO0tBRWhCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLE1BQU07UUFDWiw4Q0FBOEM7UUFDOUMsK0NBQStDO1FBQy9DLE1BQU0sRUFBRSxJQUFJO1FBQ1osU0FBUyxFQUFFLElBQUk7S0FFaEI7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxnQ0FBZ0MsQ0FBQztRQUMxQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsZ0NBQWdDLENBQUM7UUFDM0MsUUFBUSxFQUFFLHNCQUFzQjtLQUNqQztJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO0tBQ2I7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztRQUNsQyxPQUFPLEVBQUUsWUFBWTtRQUNyQixLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsUUFBUSxFQUFFO1FBQ1I7WUFDRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNCLEdBQUcsRUFBRSxTQUFTO1NBQ2Y7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNMO1lBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMzQixHQUFHLEVBQUUsTUFBTTtTQUNaO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUDtZQUNFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDM0IsR0FBRyxFQUFFLFFBQVE7U0FDZDtLQUNGO0NBQ0YsRUFDRDtJQUNFLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQ0YsQ0FBQztBQUVGLGtFQUFrRTtBQUNsRSxrREFBa0Q7QUFDbEQsaUJBQWlCO0FBQ2pCLEtBQUs7QUFFTCxVQUFVLENBQUMsR0FBRyxDQUFlLE1BQU0sRUFBRSxLQUFLLFdBQVUsSUFBSTtJQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNoQyxPQUFPLElBQUksRUFBRSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGdCQUFNLENBQUMsSUFBSSxDQUM1QixJQUFJLENBQUMsUUFBUSxFQUNiLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUNqQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDckIsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUVILFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUVqRCxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMifQ==