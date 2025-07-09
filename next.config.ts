import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // отключает ESLint при `next build`
  },
};

export default nextConfig;
