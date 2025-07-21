/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

module.exports = nextConfig;
