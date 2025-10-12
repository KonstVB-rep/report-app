"use client"

import type { PropsWithChildren } from "react"
import LogoutDialog from "@/feature/auth/ui/logout-dialog"
import { SiteHeader } from "@/feature/Sidebar/ui/site-header"
import { SidebarProvider } from "@/shared/components/ui/sidebar"

const AdminboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-w-64 [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <div className="flex bg-background">
          <SiteHeader isHasSitebar={false} />
          <div className="min-h-full border-b border-l px-2 items-center hidden md:flex border-border">
            <LogoutDialog withTitle={false} />
          </div>
        </div>
        {children}
      </SidebarProvider>
    </div>
  )
}

export default AdminboardLayout
