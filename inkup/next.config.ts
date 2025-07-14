import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/:path*",                  // Match all /auth routes
        destination: "http://localhost:3000*", // Proxy to Express backend
      },
    ];
  },
};

export default nextConfig;
