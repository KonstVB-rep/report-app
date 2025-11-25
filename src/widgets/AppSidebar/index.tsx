"use client"

import Link from "next/link"
import DepartmentListWrapper from "@/feature/Sidebar/ui/DepartmentListWrapper"
import { NavMain } from "@/feature/Sidebar/ui/nav-main"
import { NavUser } from "@/feature/Sidebar/ui/nav-user"
import SidebarHeaderComponent from "@/feature/Sidebar/ui/SidebarHeaderComponent"
import { Sidebar, SidebarContent, SidebarFooter } from "@/shared/components/ui/sidebar"
import ProtectedByRole from "@/shared/custom-components/ui/Protect/ProtectByRole"

const AppSidebar = () => {
  return (
    <Sidebar className="top-0 h-[calc(100svh-var(--header-height))]! min-w-64 shrink-0">
      <SidebarHeaderComponent mainPagePath={"/dashboard"} mainPageTitle={"На стратовую страницу"} />
      <SidebarContent>
        <NavMain>
          <DepartmentListWrapper />
        </NavMain>
      </SidebarContent>
      <SidebarFooter className="border-t border-muted">
        <NavUser>
          <ProtectedByRole>
            <Link className="btn_hover justify-center text-sm" href="/adminboard" prefetch={false}>
              Панель администратора
            </Link>
          </ProtectedByRole>
        </NavUser>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
