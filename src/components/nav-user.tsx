"use client";

import { BadgeCheck, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
                <span className="truncate text-xs capitalize">
                  {authUser?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >

            <DropdownMenuGroup>
              <DropdownMenuItem className="h-10 p-0">
                <Link href={`/dashboard/profile/${authUser?.id}`} className="px-2 py-1.5 rounded-md flex items-center justify-center gap-2 w-full border border-solid bg-background border-transparent h-10 hover:border-muted-foreground focus-visible:border-muted-foreground hover:bg-muted focus-visible:bg-muted">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutDialog />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
