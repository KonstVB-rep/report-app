import withBundleAnalyzer from "@next/bundle-analyzer"
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants"

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
})

const baseConfig = {
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
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias["react-devtools"] = false
    }
    return config
  },
}

const nextConfig = async (phase) => {
  let config = baseConfig

  // Serwist PWA
  if (phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "src/service-worker/app-worker.ts", // В продакшене Serwist транспилирует TS
      swDest: "public/sw.js",
      reloadOnOnline: true,
    })
    config = withSerwist(config)
  } else {
    console.warn("Service Worker disabled in development mode")
  }

  return withAnalyzer(config)
}

export default nextConfig
