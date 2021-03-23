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
    description: {
        type: String,
        trim: true,
        minlength: 10,
    },
    email: {
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
    type: {
        type: String,
        required: true,
        enum: ["commercial", "individual"],
        default: "commercial",
        index: true,
    },
    departments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Department",
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
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21vZGVscy91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1Qix3REFBZ0M7QUFFaEMsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQzNCO0lBQ0UsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsRUFBRTtLQUNkO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWiw4Q0FBOEM7UUFDOUMsK0NBQStDO1FBQy9DLE1BQU0sRUFBRSxJQUFJO1FBQ1osU0FBUyxFQUFFLElBQUk7S0FFaEI7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsTUFBTTtRQUNaLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxnQ0FBZ0MsQ0FBQztRQUMxQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsZ0NBQWdDLENBQUM7UUFDM0MsUUFBUSxFQUFFLHNCQUFzQjtLQUNqQztJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7S0FDZjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxNQUFNO0tBQ2I7SUFDRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsTUFBTTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztRQUNsQyxPQUFPLEVBQUUsWUFBWTtRQUNyQixLQUFLLEVBQUUsSUFBSTtLQUNaO0lBQ0QsV0FBVyxFQUFFO1FBQ1g7WUFDRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNCLEdBQUcsRUFBRSxZQUFZO1NBQ2xCO0tBQ0Y7SUFDRCxLQUFLLEVBQUU7UUFDTDtZQUNFLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVE7WUFDM0IsR0FBRyxFQUFFLE1BQU07U0FDWjtLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1A7WUFDRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzNCLEdBQUcsRUFBRSxRQUFRO1NBQ2Q7S0FDRjtDQUNGLEVBQ0Q7SUFDRSxVQUFVLEVBQUUsSUFBSTtDQUNqQixDQUNGLENBQUM7QUFFRixrRUFBa0U7QUFDbEUsa0RBQWtEO0FBQ2xELGlCQUFpQjtBQUNqQixLQUFLO0FBRUwsVUFBVSxDQUFDLEdBQUcsQ0FBZSxNQUFNLEVBQUUsS0FBSyxXQUFVLElBQUk7SUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDaEMsT0FBTyxJQUFJLEVBQUUsQ0FBQztLQUNmO0lBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBTSxDQUFDLElBQUksQ0FDNUIsSUFBSSxDQUFDLFFBQVEsRUFDYixNQUFNLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FDakMsQ0FBQztJQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMifQ==