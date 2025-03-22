import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] flex-1">
          <AppSidebar />
          <SidebarInset className="h-auto min-h-min">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateDashboard;
