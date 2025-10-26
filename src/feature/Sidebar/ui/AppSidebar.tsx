"use client"

import Link from "next/link"
import { Sidebar, SidebarContent, SidebarFooter } from "@/shared/components/ui/sidebar"
import ProtectedByRole from "@/shared/custom-components/ui/Protect/ProtectByRole"
import DepartmentListWrapper from "./DepartmentListWrapper"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import SidebarHeaderComponent from "./SidebarHeaderComponent"

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
