import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Comentado para permitir servidor
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true, // Ignorar errores de TypeScript durante el build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante el build
  }
};

export default nextConfig;
