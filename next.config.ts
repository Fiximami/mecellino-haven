import type { NextConfig } from "next";

const baselineSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: baselineSecurityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/attractions", destination: "/mobile-amusement", permanent: false },
      { source: "/events", destination: "/mobile-amusement", permanent: false },
      { source: "/gallery", destination: "/", permanent: false },
      { source: "/visit", destination: "/mobile-amusement", permanent: false },
    ];
  },
};

export default nextConfig;
