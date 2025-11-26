"use client"

import type { PropsWithChildren } from "react"
import Link from "next/link"
import { NavMain } from "@/feature/Sidebar/ui/nav-main"
import { NavUser } from "@/feature/Sidebar/ui/nav-user"
import SidebarHeaderComponent from "@/feature/Sidebar/ui/SidebarHeaderComponent"
import { Sidebar, SidebarContent, SidebarFooter } from "@/shared/components/ui/sidebar"

const AdminSidebar = ({ children }: PropsWithChildren) => {
  return (
    <Sidebar className="top-0 h-[calc(100svh-var(--header-height))]! min-w-64 shrink-0 min-h-screen">
      <SidebarHeaderComponent
        mainPagePath={"/adminboard"}
        mainPageTitle={"На стратовую страницу"}
      />
      <SidebarContent>
        <NavMain>{children}</NavMain>
      </SidebarContent>
      <SidebarFooter className="border-t border-muted">
        <NavUser>
          <Link className="btn_hover justify-center text-sm" href="/dashboard" prefetch={false}>
            Главная панель
          </Link>
        </NavUser>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar
