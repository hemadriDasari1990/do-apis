import config from "config";
import jwt from "jsonwebtoken";
import socketio from "socket.io";

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

export function verifyToken(token: string, io: socketio.Server): any {
  if (!token || token === null) {
    io.emit("unauthorised", null);
    return "";
  }
  return jwt.verify(token, config.get("accessTokenSecret"), function(
    err: any,
    decoded: any
  ) {
    if (err) {
      io.emit("unauthorised", null);
    }
    return decoded;
  });
}

export function getPagination(page: number, size: number) {
  if (!page && !size) {
    return { limit: 0, offset: 0 };
  }
  const limit = size ? +size : 8;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}

export function getUser(authorization: string) {
  if (!authorization) {
    return;
  }
  const token = getToken(authorization);
  const user: any = decodeToken(token);
  return user;
}
