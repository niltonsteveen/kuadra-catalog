import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack to treat this package as the root
    root: __dirname,
  },
};

export default nextConfig;
