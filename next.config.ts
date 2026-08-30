import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  output: "standalone",

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "downloader.disk.yandex.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.storage.yandex.net",
      },
      {
        protocol: "https",
        hostname: "ertel-shop.ru",
      },
    ],
    qualities: [25, 50, 75, 80, 90, 100],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  productionBrowserSourceMaps: false,

  compiler: {
    reactRemoveProperties: false,
  },

  turbopack: {
    resolveAlias: {
      "react-devtools": "turbopack-empty-module",
    },
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.NEXT_PUBLIC_API_BASE_URL
          ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin
          : "http://localhost:3000",
      ],
    },
    optimizePackageImports: [
      "@radix-ui/react-*",
      "lucide-react",
      "recharts",
      "date-fns",
      "clsx",
      "tailwind-merge",
      "zod",
      "exceljs",
      "@tanstack/react-table",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "react-day-picker",
      "react-hook-form",
      "react-starfield",
      "react-dropzone",
      "@fullcalendar/*",
    ],
  },

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
