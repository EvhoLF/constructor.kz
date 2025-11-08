import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      // Редирект с HTTP на HTTPS (только для HTTP запросов)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'konstruktor.kz',
          },
        ],
        missing: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
        permanent: true,
        destination: 'https://konstruktor.kz/:path*',
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;