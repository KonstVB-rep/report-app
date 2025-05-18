"use client";

import React, { createContext, useEffect } from "react";
import { usePathname } from "next/navigation";

interface LastPathContextProps {
  lastPath: string | null;
}

export const LastPathContext = createContext<LastPathContextProps>({
  lastPath: null,
});

export const LastPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" && pathname !== "/login") {
      localStorage.setItem("lastAppPath", pathname);
    }
  }, [pathname]);

  const lastPath = typeof window !== "undefined" ? localStorage.getItem("lastAppPath") : null;

  return <LastPathContext.Provider value={{ lastPath }}>{children}</LastPathContext.Provider>;
};
