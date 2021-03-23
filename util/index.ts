export function getToken(authHeader: string): any {
  if (!authHeader) {
    return "";
  }
  const token: string = authHeader.split(" ")[1];
  return token || "";
}
