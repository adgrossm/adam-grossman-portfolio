import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Hidden, unlinked, password-gated page. Serves public/private.html
      // at a clean /private URL.
      { source: "/private", destination: "/private.html" },
    ];
  },
};

export default nextConfig;
