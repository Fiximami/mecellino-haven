import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { isAdminPath } from "../lib/auth/admin-gate.ts";
import { buildAuthAuditEvent, redactAuditDetails } from "../lib/auth/audit.ts";
import { isAuthCookieName, sessionCookieOptions } from "../lib/auth/cookies.ts";
import { LOCKOUT_SCOPE } from "../lib/auth/lockout.ts";
import { isTrustedMutationOrigin } from "../lib/auth/origin.ts";
import { sessionProbeBody, sessionProbeHasSensitiveFields } from "../lib/auth/probe.ts";

const ROOT = join(import.meta.dirname, "..");

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkFiles(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

describe("security controls", () => {
  it("keeps /admin behind a 404 gate for every admin path", () => {
    assert.equal(isAdminPath("/admin"), true);
    assert.equal(isAdminPath("/admin/bookings"), true);
    assert.equal(isAdminPath("/auth/sign-in"), false);
    assert.equal(isAdminPath("/"), false);
  });

  it("sets httpOnly, SameSite=Lax and Secure-in-production cookies", () => {
    assert.deepEqual(sessionCookieOptions("production"), {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: true,
    });
    assert.equal(sessionCookieOptions("development").secure, false);
    assert.equal(isAuthCookieName("sb-example-auth-token"), true);
  });

  it("rejects cross-site mutation origins and does not trust an unset site origin", () => {
    const request = new Request("http://localhost:3000/auth/sign-out", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    });
    assert.equal(isTrustedMutationOrigin(request, { NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }), false);

    const sameSiteWithoutCanonical = new Request("http://localhost:3000/auth/sign-out", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });
    assert.equal(isTrustedMutationOrigin(sameSiteWithoutCanonical, {}), false);
    assert.equal(LOCKOUT_SCOPE, "local_single_process");
  });

  it("keeps the session probe free of tokens, claims and identifiers", () => {
    const body = sessionProbeBody(true);
    assert.deepEqual(body, { authenticated: true });
    assert.equal(sessionProbeHasSensitiveFields(body), false);
    assert.equal(
      sessionProbeHasSensitiveFields({
        authenticated: true,
        userId: "synthetic-staff-001",
        role: "system_administrator",
      }),
      true,
    );
  });

  it("does not write tokens or personal details into audit events", () => {
    const event = buildAuthAuditEvent({ class: "sign_in", result: "failure" });
    assert.equal("class" in event && "result" in event && "at" in event, true);
    assert.equal("email" in event, false);
    assert.equal("token" in event, false);
    assert.deepEqual(redactAuditDetails({ email: "a@b.c", password: "secret", token: "abc" }), {
      email: "[redacted]",
      password: "[redacted]",
      token: "[redacted]",
    });
  });

  it("does not reuse booking_inquiries policies or open Realtime subscriptions", () => {
    const scannedRoots = ["app", "lib", "components", "config", "proxy.ts"].map((name) =>
      join(ROOT, name),
    );
    const files = scannedRoots.flatMap((root) =>
      statSync(root).isDirectory() ? walkFiles(root) : [root],
    );
    const source = files
      .filter((file) => /\.(ts|tsx|js)$/.test(file))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    assert.equal(source.includes(".channel("), false);
    assert.equal(source.includes(".subscribe("), false);
    assert.equal(source.includes("booking_inquiries"), false);
    assert.equal(source.includes("TO authenticated"), false);
  });

  it("does not store minor or participant personal records", () => {
    const files = walkFiles(join(ROOT, "lib")).concat(walkFiles(join(ROOT, "app")));
    const joined = files.map((file) => readFileSync(file, "utf8")).join("\n");
    const banned = ["dateOfBirth", "guardianPhone", "CREATE TABLE"];
    assert.equal(
      banned.some((token) => joined.includes(token)),
      false,
    );
  });
});
