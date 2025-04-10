import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        // Rewrite all API calls except those for NextAuth (which start with /api/auth)
        source: '/api/:path((?!auth).*)',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;