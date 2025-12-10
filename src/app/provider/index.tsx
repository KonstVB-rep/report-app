"use client"

import { type PropsWithChildren, Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import dynamic from "next/dynamic"
import { Toaster } from "sonner"
import { LastPathProvider } from "./last-path-provider"
import QueryProvider from "./query-provider"
import { ThemeProvider } from "./theme-provider"

const ReactQueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools),
  {
    ssr: false,
  },
)

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <Suspense fallback={null}>
      <LastPathProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          storageKey="theme"
        >
          <QueryProvider>
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
            <Toaster position="top-center" />
            <SpeedInsights />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </LastPathProvider>
    </Suspense>
  )
}

export default AppProvider
