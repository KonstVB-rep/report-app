"use client";

import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
          {children}
        </QueryProvider>
      </ThemeProvider>
    </>
  );
};

export default AppProvider;
