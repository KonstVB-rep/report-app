import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: true, // лучше отключить в проде

  reactStrictMode: true,

  experimental: {
    scrollRestoration: true,
    serverActions: {},
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias["react-devtools"] = false;
    }

    return config;
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzerConfig(nextConfig);