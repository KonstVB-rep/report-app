import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

/**
 * Оптимальный конфиг для уменьшения веса бандлов и улучшения Lighthouse
 */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,

  // ✅ Отключаем React Dev Overlay в проде (чтобы не грузилось лишнее)
  reactStrictMode: true,

  experimental: {
    // Оптимизация загрузки ресурсов
    optimizeCss: true,
    scrollRestoration: true,
    serverActions: {},
  },

  webpack: (config, { dev, isServer }) => {
    // Убираем devtools из финального бандла
    if (!dev && !isServer) {
      config.resolve.alias["react-dom"] = "react-dom";
      config.resolve.alias["react-devtools"] = false;
    }

    return config;
  },
};

// Включаем анализатор бандлов только если задана переменная окружения
const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzerConfig(nextConfig);
