"use client";

import Link from "next/link";

import { BadgeCheck, ChevronsUpDown } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useStoreUser from "@/entities/user/store/useStoreUser";
import DialogAddUser from "@/entities/user/ui/DialogAddUser";
import LogoutDialog from "@/feature/auth/ui/logout-dialog";
import HoverCardComponent from "@/shared/ui/HoverCard";

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { authUser } = useStoreUser();

  const username = authUser?.username ?? "";
  const email = authUser?.email ?? "";
  const userId = authUser?.id ?? "";
  const departmentId = authUser?.departmentId ?? "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DialogAddUser />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <HoverCardComponent
          title={
            <div className="flex flex-1 items-center justify-between gap-1 text-left text-sm leading-tight">
              <div className="grid gap-1">
                <span className="truncate font-semibold capitalize">
                  {username}
                </span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown />
            </div>
          }
          side={isMobile ? "bottom" : "right"}
          align="start"
          alignOffset={20}
          className="relative -top-1"
        >
          <div className="grid min-w-40 gap-1">
            <Link
              href={`/dashboard/profile/${departmentId}/${userId}`}
              className="btn_hover w-full justify-center text-sm"
            >
              <BadgeCheck className="h-4 w-4" />
              <span>Профиль</span>
            </Link>
            <LogoutDialog />
          </div>
        </HoverCardComponent>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
