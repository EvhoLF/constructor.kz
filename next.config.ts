import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      // Редирект с HTTP на HTTPS для основного домена
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'konstruktor.kz',
          },
        ],
        permanent: true,
        destination: 'https://konstruktor.kz/:path*',
      },
      // Редирект с www на без www + HTTPS (опционально)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.konstruktor.kz',
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
      // Добавьте явное исключение для API routes
      {
        source: '/api/:path*',
        destination: '/api/:path*',
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