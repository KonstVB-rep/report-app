"use client"

import type { ReactNode } from "react"
import { SiteHeader } from "@/feature/Sidebar/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"
import AppSidebar from "@/widgets/AppSidebar"

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-w-64 [--header-height:calc(--spacing(14))] h-screen">
      <SidebarProvider className="h-full bottom-0">
        <AppSidebar />
        <main className="w-full">
          <SiteHeader />
          <SidebarInset className="h-auto min-h-min">
            <div className="flex-1">{children}</div>
          </SidebarInset>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout
