import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.yimg.com',
        port: '',
        pathname: '/uu/api/res/**',
      },
      {
        protocol: 'https',
        hostname: 'media.zenfs.com',
        port: '',
        pathname: '/en/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
