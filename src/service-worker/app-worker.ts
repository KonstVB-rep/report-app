import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { Serwist } from "serwist"
import { SW_VERSION } from "@/app/sw-version"

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST?.map((e) => ({
    ...e,
    revision: SW_VERSION,
  })),
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  runtimeCaching: [
    ...defaultCache,

    // ⭐ Кэш API запросов
    {
      matcher: ({ request }) => request.destination === "" && request.url.includes("/api/"),
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 3,
        expiration: {
          maxAgeSeconds: 60 * 5, // 5 минут
        },
      },
    },

    // ⭐ Кэш изображений
    {
      matcher: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: { maxEntries: 200 },
      },
    },
  ],

  // ⭐ Оффлайн fallback
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document"
        },
      },
    ],
  },
})

serwist.addEventListeners()

// ⭐ Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}

  event.waitUntil(
    self.registration.showNotification(data.title ?? "Новое уведомление", {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      data: data.url ?? "/",
    }),
  )
})

// Открытие по клику
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow(event.notification.data))
})
