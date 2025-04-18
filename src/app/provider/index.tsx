"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import React, { PropsWithChildren } from "react";

import { Toaster } from "sonner";

import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"

// import { ReactScan } from "../ReactScanComponent";

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/* <ReactScan /> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <ReactQueryDevtools />
          <Toaster position="top-center" />
          <SpeedInsights/>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </>
  );
};

export default AppProvider;
