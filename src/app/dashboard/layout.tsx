"use client"

import type { PropsWithChildren } from "react"
import { SiteHeader } from "@/feature/Sidebar/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"
import { TooltipProvider } from "@/shared/components/ui/tooltip"
import ContentWIthRequiredUserWrapper from "@/shared/custom-components/ui/ContentWIthRequiredUserWrapper"
import AppSidebar from "@/widgets/AppSidebar"

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-w-64 [--header-height:calc(--spacing(14))] h-screen">
      <TooltipProvider delayDuration={150}>
        <ContentWIthRequiredUserWrapper>
          <SidebarProvider className="h-full bottom-0">
            <AppSidebar />
            <main className="w-full">
              <SiteHeader />
              <SidebarInset className="h-auto min-h-screen flex flex-col">
                <div className="flex-1 flex flex-col">{children}</div>
              </SidebarInset>
            </main>
          </SidebarProvider>
        </ContentWIthRequiredUserWrapper>
      </TooltipProvider>
    </div>
  )
}

export default DashboardLayout
