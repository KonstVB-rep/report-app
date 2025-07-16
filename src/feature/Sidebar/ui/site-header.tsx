"use client";

import { DealType, PermissionEnum } from "@prisma/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, SidebarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink";
import useStoreUser from "@/entities/user/store/useStoreUser";
import HoverCardComponent from "@/shared/ui/HoverCard";
import MobileMenu from "@/shared/ui/MobileMenu";

const ProtectedByPermissions = dynamic(
  () => import("@/shared/ui/Protect/ProtectedByPermissions"),
  { ssr: false }
);

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL];

export function SiteHeader() {
  const { authUser } = useStoreUser();
  const { toggleSidebar } = useSidebar();
  const pathName = usePathname();

  const userId = authUser?.id;
  const departmentId = authUser?.departmentId;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-[--header-height] items-center justify-between gap-2 px-4">
        {/* Левая часть: кнопка сайдбара */}
        <div className="flex items-center gap-4">
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Открыть/закрыть боковую панель"
          >
            <SidebarIcon />
          </Button>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>

        {/* Центр: действия (для md и выше) */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={`/dashboard/tasks/${departmentId}/${userId}`}
            className="btn_hover text-sm font-medium"
          >
            Мои задачи
          </Link>

          <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
            <Link
              href={`/dashboard/tasks/${departmentId}`}
              className="btn_hover text-sm font-medium"
            >
              Все задачи
            </Link>
          </ProtectedByPermissions>

          {!pathName?.includes("summary-table") && (
            <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
              <HoverCardComponent title="Сводные таблицы">
                {namePagesByDealType.map((type) => (
                  <div key={type} className="relative overflow-hidden rounded-sm">
                    <SummaryTableLink
                      type={type}
                      departmentId="1"
                      className="btn_hover"
                    />
                  </div>
                ))}
              </HoverCardComponent>
            </ProtectedByPermissions>
          )}

          <Button variant="outline" asChild className="h-12 w-12">
            <Link href={`/dashboard/calendar/${userId}`} title="Календарь">
              <CalendarClock />
            </Link>
          </Button>

          <ModeToggle />
        </div>

        {/* Правая часть (всегда): мобильное меню */}
        <MobileMenu />
      </div>
    </header>
  );
}
