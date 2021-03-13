"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const TokenSchema = new Schema({
    organizationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Organizaton",
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1hr" },
});
exports.default = mongoose_1.default.model("Token", TokenSchema);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9tb2RlbHMvdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFFaEMsTUFBTSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUM7SUFDN0IsY0FBYyxFQUFFO1FBQ2QsSUFBSSxFQUFFLGtCQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRO1FBQ3BDLFFBQVEsRUFBRSxJQUFJO1FBQ2QsR0FBRyxFQUFFLGFBQWE7S0FDbkI7SUFDRCxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7SUFDdkMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0NBQzdELENBQUMsQ0FBQztBQUVILGtCQUFlLGtCQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyJ9