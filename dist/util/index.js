"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getToken(authHeader) {
    if (!authHeader) {
        return "";
    }
    const token = authHeader.split(" ")[1];
    return token || "";
}
exports.getToken = getToken;
function decodeToken(token) {
    if (!token) {
        return "";
    }
    return jsonwebtoken_1.default.decode(token);
}
exports.decodeToken = decodeToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdFQUErQjtBQUUvQixTQUFnQixRQUFRLENBQUMsVUFBa0I7SUFDekMsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxNQUFNLEtBQUssR0FBVyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBTkQsNEJBTUM7QUFFRCxTQUFnQixXQUFXLENBQUMsS0FBYTtJQUN2QyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE9BQU8sc0JBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUxELGtDQUtDIn0=