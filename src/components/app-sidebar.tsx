// AppSidebar.tsx - Клиентский компонент
"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { BadgeRussianRuble, Wrench } from "lucide-react";
import { UserResponse } from "@/entities/user/types";
import {
  DepartmentInfo,
  DepartmentListType,
} from "@/entities/department/types";
import Link from "next/link";
import Image from "next/image";
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks.tsx";

const icons = {
  SALES: <BadgeRussianRuble />,
  TECHNICAL: <Wrench />,
};

export function AppSidebar() {
  const { data: departments } = useGetDepartmentsWithUsers();

  if (!departments) {
    return null;
  }

  const navMainItems = (departments as DepartmentInfo[]).map(
    (dept: DepartmentInfo) => ({
      id: dept.id,
      title: dept.name,
      icon: icons[dept.name],
      url: `/department/${dept.id}`,
      directorId: dept.directorId,
      items: dept.users.map((person: Omit<UserResponse, "email" | "role">) => ({
        id: person.id,
        departmentId: person.departmentId,
        username: person.username,
        position: person.position,
        url: `/table/`,
      })),
    })
  );

  const data: { navMain: DepartmentListType[] } = {
    navMain: navMainItems,
  };

  return (
    <Sidebar className="top-[--header-height] !h-[calc(100svh-var(--header-height))] min-w-64 shrink-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" variant="outline" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-blue-600 text-sidebar-primary-foreground">
                  <Image src="/logo.png" alt="logo" width={24} height={24} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold italic">
                    Ertel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-muted">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
