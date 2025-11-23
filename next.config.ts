import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        jsdom: false,
        parse5: false,
      };
    }
    return config;
  },
  transpilePackages: ["parse5"],
  images: {
    domains: [
      "localhost", // For development
    ],
  },
};

export default nextConfig;
