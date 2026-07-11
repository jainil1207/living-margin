import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Disable webpack cache to prevent Array Buffer Memory Allocation crashes on 32-bit Node.js
    config.cache = false;
    return config;
  },
};

export default nextConfig;
