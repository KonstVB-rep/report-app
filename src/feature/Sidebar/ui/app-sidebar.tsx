"use client";

import * as React from "react";
import { memo, useEffect, useMemo } from "react";

import Image from "next/image";

import { BadgeRussianRuble, ChartNoAxesCombined, Wrench } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks.tsx";
import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import {
  DepartmentInfo,
  DepartmentListItemType,
  UnionTypeDepartmentsName,
} from "@/entities/department/types";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { UserResponse } from "@/entities/user/types";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const icons = {
  SALES: <BadgeRussianRuble />,
  TECHNICAL: <Wrench />,
  MARKETING: <ChartNoAxesCombined />,
};

const urlPath = (depsId: number): Record<UnionTypeDepartmentsName, string> => ({
  SALES: `/table/${depsId}`,
  TECHNICAL: "",
  MARKETING: `/statistics/request-source`,
});

const AppSidebar = () => {
  const { departments } = useStoreDepartment();
  const { isAuth } = useStoreUser();
  const { setDepartments } = useStoreDepartment();

  const { data: departmentData } = useGetDepartmentsWithUsers(isAuth);

  useEffect(() => {
    if (departmentData) {
      setDepartments(departmentData);
    }
  }, [departmentData, setDepartments]);

  const navMainItems = useMemo(() => {
    if (!departments || !departments.length) {
      return [];
    }
    return (departments as DepartmentInfo[]).map((dept: DepartmentInfo) => ({
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
        url: urlPath(person.departmentId)[dept.name],
      })),
    })) as DepartmentListItemType[];
  }, [departments]);

  const data: { navMain: DepartmentListItemType[] } = {
    navMain: navMainItems,
  };

  if (!departments || !departments.length) {
    return null;
  }

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
                    className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold italic">
                    Ertel
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain.length ? data.navMain : []} />
      </SidebarContent>
      <SidebarFooter className="border-t border-muted">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default memo(AppSidebar);
