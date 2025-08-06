import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removemos output: 'export' para permitir el uso de middleware
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
