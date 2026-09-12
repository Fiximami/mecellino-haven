import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isHostedAuthenticationReady,
  isTrustedMutationOrigin,
  readCanonicalSiteOrigin,
} from "../lib/auth/origin.ts";

const VALID_AUTH = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.x",
};

function post(url: string, headers: Record<string, string>): Request {
  return new Request(url, { method: "POST", headers });
}

describe("hosted origin requirement", () => {
  it("treats a missing or placeholder origin as locally safe and not hosted-ready", () => {
    assert.equal(readCanonicalSiteOrigin({}), null);
    assert.equal(
      readCanonicalSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://your-production-domain.example" }),
      null,
    );
    assert.equal(isHostedAuthenticationReady({}), false);
    assert.equal(isHostedAuthenticationReady({ ...VALID_AUTH }), false);
    assert.equal(
      isHostedAuthenticationReady({
        ...VALID_AUTH,
        NEXT_PUBLIC_SITE_URL: "https://your-production-domain.example",
      }),
      false,
    );
    assert.equal(
      isTrustedMutationOrigin(post("http://127.0.0.1:3000/auth/sign-out", { origin: "http://127.0.0.1:3000" }), {}),
      false,
    );
  });

  it("denies cross-origin mutations even when a canonical origin is configured", () => {
    const env = { NEXT_PUBLIC_SITE_URL: "https://ydg.example" };
    assert.equal(
      isTrustedMutationOrigin(post("https://ydg.example/auth/sign-out", { origin: "https://evil.example" }), env),
      false,
    );
    assert.equal(
      isTrustedMutationOrigin(post("https://ydg.example/auth/sign-out", { origin: "https://ydg.example" }), env),
      true,
    );
  });

  it("does not let Host or forwarded-host spoofing bypass origin checks", () => {
    const env = { NEXT_PUBLIC_SITE_URL: "https://ydg.example" };
    const spoofed = post("https://ydg.example/auth/sign-out", {
      origin: "https://evil.example",
      host: "ydg.example",
      "x-forwarded-host": "ydg.example",
      "x-forwarded-proto": "https",
    });
    assert.equal(isTrustedMutationOrigin(spoofed, env), false);

    const hostOnly = post("https://ydg.example/auth/sign-out", {
      host: "ydg.example",
      "x-forwarded-host": "ydg.example",
    });
    assert.equal(isTrustedMutationOrigin(hostOnly, env), false);

    const missingCanonical = post("http://127.0.0.1:3000/auth/sign-out", {
      origin: "http://127.0.0.1:3000",
      host: "ydg.example",
      "x-forwarded-host": "ydg.example",
    });
    assert.equal(isTrustedMutationOrigin(missingCanonical, {}), false);
  });

  it("does not declare hosted authentication ready without an approved HTTPS canonical origin", () => {
    assert.equal(
      isHostedAuthenticationReady({
        ...VALID_AUTH,
        NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
      }),
      false,
    );
    assert.equal(
      isHostedAuthenticationReady({
        NEXT_PUBLIC_SITE_URL: "https://ydg.example",
      }),
      false,
    );
    assert.equal(
      isHostedAuthenticationReady({
        ...VALID_AUTH,
        NEXT_PUBLIC_SITE_URL: "https://ydg.example",
      }),
      true,
    );
  });
});
