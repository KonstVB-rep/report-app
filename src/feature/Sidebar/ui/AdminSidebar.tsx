"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Bot, Users } from "lucide-react";

const AdminSidebar = () => {
  return (
    <Sidebar className="top-0 !h-[calc(100svh-var(--header-height))] min-w-64 shrink-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" variant="outline" asChild>
              <div>
                <div className="flex aspect-square size-[1.5rem] items-center justify-center rounded-sm bg-blue-600 text-sidebar-primary-foreground">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={16}
                    height={16}
                    style={{ width: "16px", height: "16px" }}
                    className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Link
                    href="/dashboard"
                    className="truncate text-lg font-semibold italic cursor-pointer"
                  >
                    Ertel
                  </Link>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain>
          <Link className="btn_hover text-sm justify-start" href="/adminboard/bots"><Bot size={16}/>Телеграмм боты</Link>
          <Link className="btn_hover text-sm justify-start" href="/adminboard/employees"><Users size={16}/>Сотрудники</Link>
        </NavMain>
      </SidebarContent>
      <SidebarFooter className="border-t border-muted">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
