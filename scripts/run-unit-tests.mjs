import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const files = readdirSync("tests")
  .filter((name) => name.endsWith(".test.ts"))
  .map((name) => join("tests", name));

if (files.length === 0) {
  console.error("No unit tests found.");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    "--import",
    "./scripts/ts-extension-hooks.mjs",
    "--experimental-strip-types",
    "--test",
    ...files,
  ],
  { stdio: "inherit" },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
