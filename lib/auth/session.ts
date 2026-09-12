import { anonymousIdentity, identityFromProtectedClaims, type AuthIdentity } from "./identity";
import { createClient } from "../supabase/server";

type AuthUserLike = {
  app_metadata?: unknown;
  user_metadata?: unknown;
};

async function loadValidatedUser(): Promise<AuthUserLike | null> {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function getServerIdentity(): Promise<AuthIdentity> {
  const user = await loadValidatedUser();
  if (!user) {
    return anonymousIdentity();
  }

  return identityFromProtectedClaims({
    appMetadata: user.app_metadata,
    userMetadata: user.user_metadata,
  });
}

export async function isSessionAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) {
    return false;
  }

  try {
    if (typeof supabase.auth.getClaims === "function") {
      const { data, error } = await supabase.auth.getClaims();
      return !error && Boolean(data?.claims);
    }
  } catch {
    return false;
  }

  const user = await loadValidatedUser();
  return user !== null;
}
