"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getPagination = exports.verifyToken = exports.decodeToken = exports.getToken = void 0;
const config_1 = __importDefault(require("config"));
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
function verifyToken(token, io) {
    if (!token || token === null) {
        io.emit("unauthorised", null);
        return "";
    }
    return jsonwebtoken_1.default.verify(token, config_1.default.get("accessTokenSecret"), function (err, decoded) {
        if (err) {
            io.emit("unauthorised", null);
        }
        return decoded;
    });
}
exports.verifyToken = verifyToken;
function getPagination(page, size) {
    if (!page && !size) {
        return { limit: 0, offset: 0 };
    }
    const limit = size ? +size : 8;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}
exports.getPagination = getPagination;
function getUser(authorization) {
    if (!authorization) {
        return;
    }
    const token = getToken(authorization);
    const user = decodeToken(token);
    return user;
}
exports.getUser = getUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixnRUFBK0I7QUFHL0IsU0FBZ0IsUUFBUSxDQUFDLFVBQWtCO0lBQ3pDLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsTUFBTSxLQUFLLEdBQVcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7QUFDckIsQ0FBQztBQU5ELDRCQU1DO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLEtBQWE7SUFDdkMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxPQUFPLHNCQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFMRCxrQ0FLQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxLQUFhLEVBQUUsRUFBbUI7SUFDNUQsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1FBQzVCLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxPQUFPLHNCQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLFVBQ3hELEdBQVEsRUFDUixPQUFZO1FBRVosSUFBSSxHQUFHLEVBQUU7WUFDUCxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMvQjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWRELGtDQWNDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLElBQVksRUFBRSxJQUFZO0lBQ3RELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDbEIsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO0tBQ2hDO0lBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXZDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDM0IsQ0FBQztBQVJELHNDQVFDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLGFBQXFCO0lBQzNDLElBQUksQ0FBQyxhQUFhLEVBQUU7UUFDbEIsT0FBTztLQUNSO0lBQ0QsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sSUFBSSxHQUFRLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFQRCwwQkFPQyJ9