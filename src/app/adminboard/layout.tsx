"use client"

import type { PropsWithChildren } from "react"
import { SiteHeader } from "@/feature/Sidebar/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"
import AdminSidebar from "@/widgets/AminSidebar"
import LinksPageBlock from "./ui/LinksPageBlock"

const AdminboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-w-64 [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SidebarProvider className="h-full bottom-0">
          <AdminSidebar>
            <LinksPageBlock />
          </AdminSidebar>
          <main className="w-full px-2">
            <SiteHeader />
            <SidebarInset className="h-auto min-h-min">
              <div className="flex-1">{children}</div>
            </SidebarInset>
          </main>
        </SidebarProvider>
      </SidebarProvider>
    </div>
  )
}

export default AdminboardLayout
