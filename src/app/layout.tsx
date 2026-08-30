import type { Metadata, Viewport } from "next"
import "@/shared/custom-components/ui/DateRangeFilter/datePickerStyles.css"
import "./globals.css"
import AppProvider from "./provider"
import { Noto_Sans } from "next/font/google"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "CRM web app",
  description: "Приложеник для учета поступающих заявок",
  icons: [
    { rel: "icon", url: "/icon-192x192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512x512.png", sizes: "512x512" },
    { rel: "apple-touch-icon", url: "/icon-192x192.png", sizes: "192x192" },
    { rel: "apple-touch-icon", url: "/icon-512x512.png", sizes: "512x512" },
  ],
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Report App",
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
      <body className={`${notoSans.className} antialiased`} suppressHydrationWarning>
        <AppProvider>
          <div className="overflow-hidden h-screen">{children}</div>
        </AppProvider>
      </body>
    </html>
  )
}
