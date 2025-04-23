"use client";

import { PropsWithChildren } from "react";

import { usePathname } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import PageTransitionY from "@/shared/ui/MotionComponents/PageTransitionY";
import { SiteHeader } from "@/feature/SideBar/ui/site-header";
import AppSidebar from "@/feature/SideBar/ui/app-sidebar";

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  return (
    <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex-1">
          <AppSidebar />
          <SidebarInset className="h-auto min-h-min" key={pathname}>
            <PageTransitionY>{children}</PageTransitionY>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateDashboard;
