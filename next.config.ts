import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Following-Non-Follower',
};

export default nextConfig;
