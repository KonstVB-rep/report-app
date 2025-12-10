import type { NextConfig } from "next" // 1. Импортируем тип
import withBundleAnalyzer from "@next/bundle-analyzer"
import { PHASE_PRODUCTION_BUILD } from "next/constants"

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
})

// 2. Явно указываем тип NextConfig
const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "downloader.disk.yandex.ru", pathname: "/**" },
      { protocol: "https", hostname: "*.storage.yandex.net" },
    ],
    qualities: [25, 50, 75, 80, 90, 100],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: false },
  reactStrictMode: true,
  experimental: {
    staleTimes: { dynamic: 0, static: 0 },
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
    maxInactiveAge: 5 * 60 * 1000,
    pagesBufferLength: 5,
  },
  // 3. Типизируем аргументы webpack
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      config.resolve.alias["react-devtools"] = false
    }
    return config
  },
}

// 4. Типизируем phase
const nextConfig = async (phase: string) => {
  // 5. Указываем, что config — это NextConfig, чтобы можно было перезаписывать его
  let config: NextConfig = baseConfig

  // Serwist PWA
  if (phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "src/service-worker/app-worker.ts",
      swDest: "public/sw.js",
      reloadOnOnline: true,
    })
    // Теперь ошибок нет, так как config имеет правильный тип
    config = withSerwist(config)
  } else {
    console.warn("Service Worker disabled in development mode")
  }

  return withAnalyzer(config)
}

export default nextConfig
