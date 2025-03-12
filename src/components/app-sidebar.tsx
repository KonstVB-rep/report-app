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
import { BadgeRussianRuble, Command, Wrench } from "lucide-react";
import { getDepartmentsWithPersons } from "@/entities/department/api";
import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/entities/user/types";
import { DepartmentListType, DepartmentTypeSidebar } from "@/entities/department/types";
import { TOAST } from "@/entities/user/ui/Toast";
import Link from "next/link";

const icons = {
  SALES: <BadgeRussianRuble />,
  TECHNICAL: <Wrench />,
};

export function AppSidebar() {
  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["depsWithEmp"],
    queryFn: async () => {
      try {
        return await getDepartmentsWithPersons();
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
  });

  if (isLoading)
    return (
      <div className="grid content-start gap-2 p-4 min-w-64">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full rounded-xl bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="grid content-start gap-2 p-4 min-w-64">
        <p>Не удалось получить данные</p>
        <p>Попробуйте перезагрузить страницу</p>
      </div>
    );

  const navMainItems = (departments as DepartmentTypeSidebar[]).map(
    (dept: DepartmentTypeSidebar) => ({
      id: dept.id,
      title: dept.name,
      icon: icons[dept.name],
      url: `/dashboard/department/${dept.id}`,
      directorId: dept.directorId,
      items: dept.users.map((person: Omit<UserResponse, "email" | "role">) => ({
        id: person.id,
        departmentId: person.departmentId,
        username: person.username,
        position: person.position,
        url: `/dashboard/table/${person.id}`,
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
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ertel</span>
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
