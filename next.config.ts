import withBundleAnalyzer from "@next/bundle-analyzer";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },

  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  experimental: {
    
    serverActions: {
      allowedOrigins: [
        process.env.NEXT_PUBLIC_API_BASE_URL
          ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin
          : "http://localhost:3000",
      ].filter(Boolean) as string[],
    },
    optimizePackageImports: [
      // UI-библиотеки
      "@radix-ui/react-*", // Все Radix UI компоненты
      "lucide-react",
      "recharts",

      // Утилиты
      "date-fns",
      "clsx",
      "tailwind-merge",
      "zod",

      // Работа с данными
      "@tanstack/react-table",
      "@tanstack/react-query",
      "@tanstack/react-virtual",

      // Другое
      "react-day-picker",
      "react-hook-form",
      "react-starfield",
      "react-dropzone",
      "@fullcalendar/*"
    ],
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
  openAnalyzer: true
});

export default withBundleAnalyzerConfig(nextConfig);
