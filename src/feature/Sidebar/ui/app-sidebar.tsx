"use client";

import * as React from "react";
import { memo, useEffect, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BadgeRussianRuble, ChartNoAxesCombined, Wrench } from "lucide-react";

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import {
  DepartmentInfo,
  DepartmentListItemType,
  UnionTypeDepartmentsName,
} from "@/entities/department/types";
import { UserResponse } from "@/entities/user/types";
import logo from "@/public/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import ProtectedByRole from "@/shared/custom-components/ui/Protect/ProtectByRole";

import DepartmentPersonsList from "./DepartmentPersonsList";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const icons = {
  SALES: <BadgeRussianRuble />,
  TECHNICAL: <Wrench />,
  MARKETING: <ChartNoAxesCombined />,
};

const urlPath = (depsId: number): Record<UnionTypeDepartmentsName, string> => ({
  SALES: `/dashboard/table/${depsId}`,
  TECHNICAL: "",
  MARKETING: `/dashboard/statistics/request-source`,
});

const AppSidebar = () => {
  const pathname = usePathname();
  const { departments } = useStoreDepartment();
  const { setDepartments } = useStoreDepartment();

  const { data: departmentData } = useGetDepartmentsWithUsers();

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
      url: `/dashboard/department/${dept.id}`,
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
    return (
      <Sidebar className="top-0 h-[calc(100svh-var(--header-height))]! min-w-64 shrink-0 animate-pulse bg-primary-foreground"></Sidebar>
    );
  }

  return (
    <Sidebar className="top-0 h-[calc(100svh-var(--header-height))]! min-w-64 shrink-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {pathname !== "/dashboard" ? (
              <SidebarMenuButton size="lg" variant="outline" asChild>
                <div className="flex-1 text-left text-sm leading-tight">
                  <Link
                    href=""
                    prefetch={false}
                    className="flex gap-2 w-full truncate text-lg font-semibold italic cursor-pointer"
                    title="На главную"
                  >
                    <div className="flex aspect-square size-6 items-center justify-center rounded bg-blue-600 text-sidebar-primary-foreground">
                      <Image
                        src={logo}
                        alt="logo"
                        width={16}
                        height={16}
                        style={{ width: "16px", height: "16px" }}
                        className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
                      />
                    </div>
                    <span>Ertel</span>
                  </Link>
                </div>
              </SidebarMenuButton>
            ) : (
              <div className="flex items-center rounded-md gap-2 w-full truncate text-lg font-semibold italic p-2 py-[9px] h-12 border bg-background">
                <div className="flex aspect-square size-6 items-center justify-center rounded bg-blue-600 text-sidebar-primary-foreground">
                  <Image
                    src={logo}
                    alt="logo"
                    width={16}
                    height={16}
                    style={{ width: "16px", height: "16px" }}
                    className="drop-shadow-[0_0px_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0px_8px_rgba(0,0,0,1)]"
                  />
                </div>
                <span>Ertel</span>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain>
          {(data.navMain.length ? data.navMain : []).map((item) => (
            <DepartmentPersonsList key={item.id} item={item} />
          ))}
        </NavMain>
      </SidebarContent>
      <SidebarFooter className="border-t border-muted">
        <NavUser>
          <ProtectedByRole>
            <Link
              href="/adminboard"
              className="btn_hover justify-center text-sm"
              prefetch={false}
            >
              Панель администратора
            </Link>
          </ProtectedByRole>
        </NavUser>
      </SidebarFooter>
    </Sidebar>
  );
};

export default memo(AppSidebar);
