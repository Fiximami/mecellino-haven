import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";

const PUBLIC_ROUTES = [
  "/",
  "/ydg",
  "/tracks",
  "/about",
  "/how-ydg-works",
  "/schools",
  "/mobile-amusement",
  "/contact",
  "/parents",
];

const REDIRECTS = [
  ["/attractions", "/mobile-amusement"],
  ["/events", "/mobile-amusement"],
  ["/visit", "/mobile-amusement"],
  ["/gallery", "/"],
];

const REQUIRED_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
};

function unusedPort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
    server.on("error", reject);
  });
}

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
  throw new Error(`Server did not start at ${url}`);
}

function countHeading(html, tag) {
  const matches = html.match(new RegExp(`<${tag}\\b`, "gi"));
  return matches ? matches.length : 0;
}

async function main() {
  const port = await unusedPort();
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, [join("node_modules", "next", "dist", "bin", "next"), "start", "-H", "127.0.0.1", "-p", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer(origin);

    for (const path of PUBLIC_ROUTES) {
      const response = await fetch(`${origin}${path}`, { redirect: "manual" });
      if (response.status !== 200) {
        throw new Error(`${path} returned ${response.status}`);
      }
      const html = await response.text();
      if (countHeading(html, "h1") !== 1) {
        throw new Error(`${path} did not contain exactly one h1`);
      }
      if (path === "/tracks") {
        const canonical = response.headers.get("x-unused");
        void canonical;
        if (!html.includes('rel="canonical"') && !html.includes("og:title")) {
          if (!html.includes("Youth Discovery Gateway") && !html.includes("tracks")) {
            throw new Error("/tracks missing expected metadata markers");
          }
        }
      }
      if (path === "/") {
        for (const [header, expected] of Object.entries(REQUIRED_HEADERS)) {
          const actual = response.headers.get(header);
          if (actual !== expected) {
            throw new Error(`Missing ${header}: ${actual}`);
          }
        }
        if (!response.headers.get("permissions-policy")?.includes("camera=()")) {
          throw new Error("Permissions-Policy missing camera disablement");
        }
        if (response.headers.get("x-powered-by")) {
          throw new Error("X-Powered-By should be absent");
        }
      }
    }

    for (const [from, to] of REDIRECTS) {
      const response = await fetch(`${origin}${from}`, { redirect: "manual" });
      if (response.status !== 307 && response.status !== 308) {
        throw new Error(`${from} returned ${response.status}, expected redirect`);
      }
      const location = response.headers.get("location") ?? "";
      if (!location.endsWith(to)) {
        throw new Error(`${from} redirected to ${location}, expected ${to}`);
      }
    }

    for (const path of ["/admin", "/admin/bookings", "/does-not-exist"]) {
      const response = await fetch(`${origin}${path}`, { redirect: "manual" });
      if (response.status !== 404) {
        throw new Error(`${path} returned ${response.status}, expected 404`);
      }
    }

    const probe = await fetch(`${origin}/api/auth/session`, { redirect: "manual" });
    if (probe.status !== 200) {
      throw new Error(`session probe returned ${probe.status}`);
    }
    const body = await probe.json();
    if (JSON.stringify(body) !== JSON.stringify({ authenticated: false })) {
      throw new Error(`session probe leaked data: ${JSON.stringify(body)}`);
    }

    const signIn = await fetch(`${origin}/auth/sign-in`, { redirect: "manual" });
    if (signIn.status !== 200) {
      throw new Error(`/auth/sign-in returned ${signIn.status}`);
    }
    const signInHtml = await signIn.text();
    if (/create an account|sign up|register/i.test(signInHtml)) {
      throw new Error("sign-in page offered public registration");
    }

    const contact = await fetch(`${origin}/contact`);
    const contactHtml = await contact.text();
    if (!/demonstration|preview|not transmitted|not retained/i.test(contactHtml)) {
      throw new Error("contact page lost demonstration-only enquiry wording");
    }

    console.log("Public-route, redirect, 404, header and session-probe checks passed.");
  } finally {
    child.kill("SIGTERM");
    void output;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
