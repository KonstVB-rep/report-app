"use client"

import type { ReactNode } from "react"
import { BadgeCheck, ChevronsUpDown } from "lucide-react"
import Link from "next/link"
import useStoreUser from "@/entities/user/store/useStoreUser"
import LogoutDialog from "@/feature/auth/ui/logout-dialog"
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/shared/components/ui/sidebar"
import HoverCardComponent from "@/shared/custom-components/ui/HoverCard"

export const NavUser = ({ children }: { children?: ReactNode }) => {
  const { isMobile } = useSidebar()
  const { authUser } = useStoreUser()

  const username = authUser?.username ?? ""
  const email = authUser?.email ?? ""
  const userId = authUser?.id ?? ""
  const departmentId = authUser?.departmentId ?? ""

  return (
    <SidebarMenu>
      <SidebarMenuItem>{children}</SidebarMenuItem>
      <SidebarMenuItem>
        <HoverCardComponent
          align="start"
          alignOffset={20}
          className="relative -top-1"
          side={isMobile ? "bottom" : "right"}
          title={
            <div className="flex flex-1 items-center justify-between gap-1 text-left text-sm leading-tight">
              <div className="grid gap-1">
                <span className="truncate font-semibold capitalize">{username}</span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown />
            </div>
          }
        >
          <div className="grid min-w-40 gap-1">
            <Link
              className="btn_hover w-full justify-center text-sm"
              href={`/dashboard/profile/${departmentId}/${userId}`}
              prefetch={false}
            >
              <BadgeCheck className="h-4 w-4" />
              <span>Профиль</span>
            </Link>
            <LogoutDialog />
          </div>
        </HoverCardComponent>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
