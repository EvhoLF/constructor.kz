import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true, // отключает ESLint при `next build`
  },
};

export default nextConfig;
