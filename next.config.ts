import withBundleAnalyzer from "@next/bundle-analyzer"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "downloader.disk.yandex.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.storage.yandex.net",
      },
    ],
    qualities: [25, 50, 75, 80, 90, 100],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    // removeConsole: process.env.NODE_ENV === "production",
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
    staleTimes: {
      dynamic: 0,
      static: 0,
    },

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
      "exceljs",

      // Работа с данными
      "@tanstack/react-table",
      "@tanstack/react-query",
      "@tanstack/react-virtual",

      // Другое
      "react-day-picker",
      "react-hook-form",
      "react-starfield",
      "react-dropzone",
      "@fullcalendar/*",
    ],
  },

  // Отключаем in-memory cache
  onDemandEntries: {
    // период удержания страниц в памяти (мс)
    maxInactiveAge: 25 * 1000,
    // количество страниц, которые должны сохраняться в памяти
    pagesBufferLength: 2,
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias["react-devtools"] = false
    }

    return config
  },
}

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
})

export default withBundleAnalyzerConfig(nextConfig)
