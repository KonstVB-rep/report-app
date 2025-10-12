"use client"

import React, { type ReactNode } from "react"
import { v4 as uuid } from "uuid"
import { SiteHeader } from "@/feature/Sidebar/ui/site-header"
import { SidebarProvider } from "@/shared/components/ui/sidebar"

const DashboardLayout = ({ children, modal }: { children: ReactNode; modal?: ReactNode }) => {
  return (
    <div className="min-w-64 [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        {children}

        {React.Children.map(modal, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { key: uuid() }) : child,
        )}
      </SidebarProvider>
    </div>
  )
}

export default DashboardLayout
