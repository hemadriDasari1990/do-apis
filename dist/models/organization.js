"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const OrganizationSchema = new Schema({
    title: {
        type: String,
        trim: true,
        minlength: 1,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
        required: true,
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
    departments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Department",
        },
    ],
}, {
    timestamps: true,
});
// OrganizationSchema.statics.EncryptPassword = async function(password) {
//   const hash = await bcrypt.hash(password, 12);
//   return hash;
// };
OrganizationSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt_1.default.hash(this.password, Number(config_1.default.get("bcryptSalt")));
    this.password = hash;
    next();
});
exports.default = mongoose_1.default.model("Organization", OrganizationSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL29yZ2FuaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsd0RBQWdDO0FBRWhDLE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxNQUFNLENBQ25DO0lBQ0UsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLFNBQVMsRUFBRSxDQUFDO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsRUFBRTtRQUNiLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtRQUNaLDhDQUE4QztRQUM5QywrQ0FBK0M7UUFDL0MsTUFBTSxFQUFFLElBQUk7UUFDWixTQUFTLEVBQUUsSUFBSTtLQUVoQjtJQUNELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxNQUFNO1FBQ1osR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLGdDQUFnQyxDQUFDO1FBQzFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxnQ0FBZ0MsQ0FBQztRQUMzQyxRQUFRLEVBQUUsc0JBQXNCO0tBQ2pDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsS0FBSztLQUNmO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07S0FDYjtJQUNELFdBQVcsRUFBRTtRQUNYO1lBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMzQixHQUFHLEVBQUUsWUFBWTtTQUNsQjtLQUNGO0NBQ0YsRUFDRDtJQUNFLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQ0YsQ0FBQztBQUVGLDBFQUEwRTtBQUMxRSxrREFBa0Q7QUFDbEQsaUJBQWlCO0FBQ2pCLEtBQUs7QUFFTCxrQkFBa0IsQ0FBQyxHQUFHLENBQXVCLE1BQU0sRUFBRSxLQUFLLFdBQVUsSUFBSTtJQUN0RSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNoQyxPQUFPLElBQUksRUFBRSxDQUFDO0tBQ2Y7SUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLGdCQUFNLENBQUMsSUFBSSxDQUM1QixJQUFJLENBQUMsUUFBUSxFQUNiLE1BQU0sQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUNqQyxDQUFDO0lBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDckIsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLGtCQUFRLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDIn0=