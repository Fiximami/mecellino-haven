import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const migration = readFileSync(
  join(import.meta.dirname, "..", "supabase", "migrations", "20250101000000_create_booking_inquiries.sql"),
  "utf8",
);

describe("legacy booking migration baseline", () => {
  it("keeps RLS enabled and grants no anon or authenticated access", () => {
    assert.match(migration, /enable row level security/i);
    assert.match(migration, /revoke all on table public\.booking_inquiries from anon/i);
    assert.match(migration, /revoke all on table public\.booking_inquiries from authenticated/i);
    assert.doesNotMatch(migration, /create policy/i);
    assert.doesNotMatch(migration, /to anon/i);
    assert.doesNotMatch(migration, /to authenticated/i);
    assert.doesNotMatch(migration, /with check \(true\)/i);
    assert.doesNotMatch(migration, /using \(true\)/i);
    assert.match(migration, /DORMANT LEGACY TABLE/i);
    assert.match(migration, /must not be used for YDG intake/i);
    assert.match(
      migration,
      /editing this source file does not remediate that database/i,
    );
  });
});
