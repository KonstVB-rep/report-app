"use client";

import { PropsWithChildren } from "react";

import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
import { SidebarProvider } from "@/shared/components/ui/sidebar";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="min-w-64 [--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          {children}
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;
