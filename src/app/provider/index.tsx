"use client";

import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import QueryProvider from "./query-provider";
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
          <Toaster position="top-center" />
          {children}
        </QueryProvider>
      </ThemeProvider>
    </>
  );
};

export default AppProvider;
