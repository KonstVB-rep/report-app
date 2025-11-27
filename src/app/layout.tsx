import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@/shared/custom-components/ui/DateRangeFilter/datePickerStyles.css"

import "./globals.css"
import AppProvider from "./provider"
import type { Viewport } from "next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CRM web app",
  description: "Приложеник для учето поступающих заявок",
  manifest: "/manifest.webmanifest",

  icons: [
    { rel: "icon", url: "/icon-192x192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512x512.png", sizes: "512x512" },

    // iOS (важно!)
    { rel: "apple-touch-icon", url: "/icon-192x192.png", sizes: "192x192" },
    { rel: "apple-touch-icon", url: "/icon-512x512.png", sizes: "512x512" },
  ],

  other: {
    // iOS PWA full-screen mode
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Report App",

    // Android Chrome PWA
    "mobile-web-app-capable": "yes",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefefe" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <div className="overflow-hidden h-screen">{children}</div>
        </AppProvider>
      </body>
    </html>
  )
}
