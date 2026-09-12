import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PROHIBITED = [/\bIGNITE\b/, /\bFDG\b/, /\bImagePlaceholder\b/, /under18-label/];
const SENSITIVE = [/SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"][^'"]+['"]/];

function walk(dir, acc = []) {
  if (!existsSync(dir)) {
    return acc;
  }
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const sourceFiles = ["app", "lib", "components", "config", "proxy.ts"]
  .map((name) => join(ROOT, name))
  .flatMap((root) => (statSync(root).isDirectory() ? walk(root) : [root]))
  .filter((file) => /\.(ts|tsx|js|mjs)$/.test(file));

const source = sourceFiles.map((file) => readFileSync(file, "utf8")).join("\n");

if (source.includes(".channel(") || /realtime\.subscribe/i.test(source)) {
  fail("Realtime usage found in application source.");
}

if (source.includes("booking_inquiries")) {
  fail("Application source references booking_inquiries.");
}

const bookingMigration = join(
  ROOT,
  "supabase",
  "migrations",
  "20250101000000_create_booking_inquiries.sql",
);
if (existsSync(bookingMigration)) {
  const sql = readFileSync(bookingMigration, "utf8");
  if (/create policy/i.test(sql) || /with check \(true\)/i.test(sql) || /using \(true\)/i.test(sql)) {
    fail("Legacy booking migration still contains open policies.");
  }
  if (!/enable row level security/i.test(sql)) {
    fail("Legacy booking migration must keep RLS enabled.");
  }
  if (!/revoke all on table public\.booking_inquiries from anon/i.test(sql)) {
    fail("Legacy booking migration must revoke anon privileges.");
  }
}

const envExample = readFileSync(join(ROOT, ".env.example"), "utf8");
if (envExample.includes("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")) {
  fail(".env.example exposes a public service-role name.");
}
if (/^SUPABASE_SERVICE_ROLE_KEY\s*=\s*\S+/m.test(envExample)) {
  fail(".env.example contains a service-role value.");
}

const scopedDocs = [
  join(ROOT, "docs", "product", "MILESTONE_4B_COMPLETION_REPORT.md"),
  join(ROOT, ".env.example"),
  ...sourceFiles,
];
for (const file of scopedDocs) {
  if (!existsSync(file)) {
    continue;
  }
  const text = readFileSync(file, "utf8");
  for (const pattern of PROHIBITED) {
    if (pattern.test(text)) {
      fail(`Prohibited term ${pattern} in ${file}`);
    }
  }
  for (const pattern of SENSITIVE) {
    if (pattern.test(text)) {
      fail(`Sensitive assignment in ${file}`);
    }
  }
}

const staticDir = join(ROOT, ".next", "static");
if (existsSync(staticDir)) {
  const bundles = walk(staticDir).filter((file) => file.endsWith(".js"));
  for (const file of bundles) {
    const text = readFileSync(file, "utf8");
    if (text.includes("SUPABASE_SERVICE_ROLE_KEY") || text.includes("service_role")) {
      fail(`Service-role string found in browser bundle ${file}`);
    }
  }
}

if (!process.exitCode) {
  console.log("Auth foundation source and bundle scans passed.");
}
