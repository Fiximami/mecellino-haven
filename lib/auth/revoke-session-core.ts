import { isAuthCookieName, sessionCookieOptions } from "./cookies";

export type SessionRevocationClient = {
  auth: {
    signOut(): Promise<unknown>;
  };
};

export type AuthCookieStore = {
  getAll(): { name: string }[];
  set(name: string, value: string, options: ReturnType<typeof sessionCookieOptions> & { maxAge: number }): void;
};

export async function revokeSession(
  client: SessionRevocationClient | null,
  store: AuthCookieStore,
): Promise<void> {
  try {
    await client?.auth.signOut();
  } catch {
    // Local cookie removal below is mandatory even when the provider is unavailable.
  }

  for (const cookie of store.getAll()) {
    if (isAuthCookieName(cookie.name)) {
      store.set(cookie.name, "", { ...sessionCookieOptions(), maxAge: 0 });
    }
  }
}
