import jwt from "jsonwebtoken";

export function getToken(authHeader: string): any {
  if (!authHeader) {
    return "";
  }
  const token: string = authHeader.split(" ")[1];
  return token || "";
}

export function decodeToken(token: string): any {
  if (!token) {
    return "";
  }
  return jwt.decode(token);
}
