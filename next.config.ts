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
      { source: "/ydg", destination: "/capacity-building/ydg", permanent: true },
      { source: "/how-ydg-works", destination: "/capacity-building/ydg/how-it-works", permanent: true },
      { source: "/tracks", destination: "/capacity-building/ydg/tracks", permanent: true },
      { source: "/mobile-amusement", destination: "/amusement", permanent: true },
      { source: "/attractions", destination: "/amusement", permanent: false },
      { source: "/events", destination: "/events-entertainment", permanent: false },
      { source: "/gallery", destination: "/", permanent: false },
      { source: "/visit", destination: "/amusement", permanent: false },
    ];
  },
};

export default nextConfig;
