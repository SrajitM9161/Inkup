/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/api/upload/:path*',
        destination: 'http://localhost:3001/api/upload/:path*', 
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.blackink.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sb.blackink.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blackink.ai',
        pathname: '/**',
      },
    ],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },

  // ⛔ Skip TypeScript type errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
