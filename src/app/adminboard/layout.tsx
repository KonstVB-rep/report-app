"use client";

import { PropsWithChildren } from "react";

import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import LogoutDialog from "@/feature/auth/ui/logout-dialog";

const AdminboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
        <SidebarProvider className="flex flex-col">
           <div className="flex bg-background">
            <SiteHeader isHasSitebar={false} />
            <div className="min-h-full border-b border-l px-2 items-center hidden md:flex">
              <LogoutDialog withTitle={false} />
            </div>
          </div>
          {children}
        </SidebarProvider>
      </div>
    </>
  );
};

export default AdminboardLayout;
