"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

import React, { PropsWithChildren } from "react";

import dynamic from "next/dynamic";

import { Toaster } from "sonner";

// import NotificationChecker from "@/feature/calendar/ui/NotificationChecker";

import { LastPathProvider } from "./last-path-provider";

import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools
    ),
  {
    ssr: false,
  }
);

// import { ReactScan } from "../ReactScanComponent";

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* <ReactScan /> */}
      <LastPathProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
              <Toaster position="top-center" />
              <SpeedInsights />
              {/* <NotificationChecker chatName="calendarChat" /> */}
              {children}
          </QueryProvider>
        </ThemeProvider>
      </LastPathProvider>
    </>
  );
};

export default AppProvider;
