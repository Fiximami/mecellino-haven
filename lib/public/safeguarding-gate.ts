export function isPublicSafeguardingPath(pathname: string): boolean {
  return pathname === "/parents" || pathname.startsWith("/parents/");
}
