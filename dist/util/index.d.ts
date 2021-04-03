import socketio from "socket.io";
export declare function getToken(authHeader: string): any;
export declare function decodeToken(token: string): any;
export declare function verifyToken(token: string, io: socketio.Server): any;
export declare function getPagination(page: number, size: number): {
    limit: number;
    offset: number;
};
export declare function getUser(authorization: string): any;
