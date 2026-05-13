import type { Metadata, Viewport } from "next";
import "@/shared/custom-components/ui/DateRangeFilter/datePickerStyles.css";
import "./globals.css";
import AppProvider from "./provider";

// Локальные заглушки для переменных, чтобы не менять разметку в body
const geistSans = { variable: "font-sans" };
const geistMono = { variable: "font-mono" };

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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefefe" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <div className="overflow-hidden h-screen">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
