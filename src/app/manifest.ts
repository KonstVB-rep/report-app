import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Report App",
    short_name: "Report",
    description: "Отчётная система с поддержкой PWA",
    id: "/?source=pwa",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#000000",
    lang: "ru",
    dir: "ltr",

    // Иконки для Android / Desktop / maskable
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    // iOS PWA support
    shortcuts: [
      {
        name: "Открыть отчёты",
        url: "/reports",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],

    // Recommended
    categories: ["productivity", "business"],
    prefer_related_applications: false,
  }
}
