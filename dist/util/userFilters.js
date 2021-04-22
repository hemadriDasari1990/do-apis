"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLookup = void 0;
const user_1 = __importDefault(require("../models/user"));
const userLookup = {
    $lookup: {
        from: user_1.default.collection.name,
        let: { userId: "$userId" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", "$$userId"] },
                },
            },
        ],
        as: "user",
    },
};
exports.userLookup = userLookup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlckZpbHRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL3VzZXJGaWx0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDBEQUFrQztBQUVsQyxNQUFNLFVBQVUsR0FBRztJQUNqQixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsY0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJO1FBQzFCLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7UUFDMUIsUUFBUSxFQUFFO1lBQ1I7Z0JBQ0UsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtpQkFDckM7YUFDRjtTQUNGO1FBQ0QsRUFBRSxFQUFFLE1BQU07S0FDWDtDQUNGLENBQUM7QUFFTyxnQ0FBVSJ9