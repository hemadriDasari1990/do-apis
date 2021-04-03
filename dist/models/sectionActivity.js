"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
delete mongoose_1.default.connection.models["SectionActivity"];
const Schema = mongoose_1.default.Schema;
const SectionActivitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        index: true,
    },
    action: {
        type: String,
        required: true,
        enum: ["create", "update", "delete", "move"],
        default: "create",
        index: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("SectionActivity", SectionActivitySchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbkFjdGl2aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbW9kZWxzL3NlY3Rpb25BY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFnQztBQUVoQyxPQUFPLGtCQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRXJELE1BQU0sTUFBTSxHQUFHLGtCQUFRLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxNQUFNLENBQ3RDO0lBQ0UsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUTtRQUMzQixHQUFHLEVBQUUsTUFBTTtRQUNYLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFDRCxTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQzNCLEdBQUcsRUFBRSxTQUFTO1FBQ2QsS0FBSyxFQUFFLElBQUk7S0FDWjtJQUNELE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7UUFDNUMsT0FBTyxFQUFFLFFBQVE7UUFDakIsS0FBSyxFQUFFLElBQUk7S0FDWjtDQUNGLEVBQ0Q7SUFDRSxVQUFVLEVBQUUsSUFBSTtDQUNqQixDQUNGLENBQUM7QUFFRixrQkFBZSxrQkFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDIn0=