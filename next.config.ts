import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN / telefon ile lokal deneme (dev)
  allowedDevOrigins: ["192.168.88.248", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "api.openverse.org", pathname: "/**" },
      { protocol: "https", hostname: "en.wikipedia.org", pathname: "/**" },
      { protocol: "https", hostname: "tr.wikipedia.org", pathname: "/**" },
    ],
    unoptimized: true,
  },
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
  ],
};

export default nextConfig;
