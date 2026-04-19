import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // Garante que cada rota tenha seu próprio index.html
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
