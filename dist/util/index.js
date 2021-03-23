"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
function getToken(authHeader) {
    if (!authHeader) {
        return "";
    }
    const token = authHeader.split(" ")[1];
    return token || "";
}
exports.getToken = getToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91dGlsL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLFFBQVEsQ0FBQyxVQUFrQjtJQUN6QyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE1BQU0sS0FBSyxHQUFXLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsT0FBTyxLQUFLLElBQUksRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFORCw0QkFNQyJ9