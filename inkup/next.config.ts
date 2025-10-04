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
  typescript: {
    ignoreBuildErrors: true,
  },
  
  webpack: (
    config: any,
    { isServer }: { buildId: string; dev: boolean; isServer: boolean; defaultLoaders: any; webpack: any }
  ) => {
    if (isServer) {
      config.output.publicPath = '';
    }
    
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: { loader: 'worker-loader' },
    });

    return config;
  },
};

module.exports = nextConfig;
