"use client";
import { BadgeCheck, ChevronsUpDown } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { LogoutDialog } from "./logout-dialog";
import useStoreUser from "@/entities/user/store/useStoreUser";
import Link from "next/link";
import HoverCardComponent from "@/shared/ui/HoverCard";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { authUser } = useStoreUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <HoverCardComponent
          title={
            <div className="flex flex-1 text-left items-center justify-between text-sm leading-tight gap-1">
              <div className="grid gap-1">
                <span className="truncate font-semibold capitalize">
                  {authUser?.username}
                </span>
                <span className="truncate text-xs">{authUser?.email}</span>
              </div>
              <ChevronsUpDown />
            </div>
          }
          side={isMobile ? "bottom" : "right"}
          align="start"
          alignOffset={20}
          classname="relative -top-1"
        >
          <div className="min-w-40 grid gap-1">
            <Link
              href={`/profile/${authUser?.id}`}
              className="btn_hover justify-center w-full text-sm"
            >
              <BadgeCheck className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </Link>
            <LogoutDialog />
          </div>
        </HoverCardComponent>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
