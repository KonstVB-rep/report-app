import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { AppSidebar } from "@/components/app-sidebar";

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  
  return (
    <div className="[--header-height:calc(theme(spacing.14))] min-w-64">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 min-h-[calc(100svh-var(--header-height)-2px)]">
            <AppSidebar />
            <SidebarInset className="min-h-min h-auto">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateDashboard;
