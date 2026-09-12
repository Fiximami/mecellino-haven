export type SessionCookieOptions = {
  path: "/";
  sameSite: "lax";
  httpOnly: true;
  secure: boolean;
};

export function sessionCookieOptions(
  nodeEnv: string | undefined = process.env.NODE_ENV,
): SessionCookieOptions {
  return {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: nodeEnv === "production",
  };
}

export function isAuthCookieName(name: string): boolean {
  return name.startsWith("sb-") && name.includes("auth-token");
}
