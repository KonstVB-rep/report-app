"use client";

import { BadgeCheck, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { LogoutDialog } from "./logout-dialog";
import useStoreUser from "@/entities/user/store/useStoreUser";
import Link from "next/link";
// import DropdownWrapper from "@/shared/ui/DropdownWrapper";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { authUser } = useStoreUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                <span className="truncate font-semibold capitalize">
                  {authUser?.username}
                </span>
                <span className="truncate text-xs">
                  {authUser?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg grid gap-1"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >

            <DropdownMenuGroup>
              <DropdownMenuItem className="h-10 p-0">
                <Link href={`/dashboard/profile/${authUser?.id}`} className="btn_hover justify-center w-full text-sm">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <LogoutDialog />
          </DropdownMenuContent>
        </DropdownMenu>

      </SidebarMenuItem>
    </SidebarMenu>
  );
}
