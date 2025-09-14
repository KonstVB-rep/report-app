"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CalendarClock, SidebarIcon } from "lucide-react";

import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { Button } from "@/shared/components/ui/button";
import { ModeToggle } from "@/shared/components/ui/mode-toggle";
import { Separator } from "@/shared/components/ui/separator";
import { useSidebar } from "@/shared/components/ui/sidebar";
import HoverCardComponent from "@/shared/custom-components/ui/HoverCard";
import Logo from "@/shared/custom-components/ui/Logo";
import MobileMenu from "@/shared/custom-components/ui/MobileMenu";

const ProtectedByPermissions = dynamic(
  () => import("@/shared/custom-components/ui/Protect/ProtectedByPermissions"),
  { ssr: false }
);

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL];

export function SiteHeader({
  isHasSitebar = true,
}: {
  isHasSitebar?: boolean;
}) {
  const { authUser } = useStoreUser();
  const { toggleSidebar } = useSidebar();
  const pathName = usePathname();

  const userId = authUser?.id;
  const departmentId = authUser?.departmentId;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background border-border">
      <div className="flex h-(--header-height) items-center justify-between gap-2 px-4">
        {isHasSitebar ? (
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
        ) : (
          <div className="hover:scale-125 transition-all duration-200">
            <Logo isTitle={false} href="/dashboard" title="На главную" />
          </div>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <Link
            prefetch={false}
            href={`/dashboard/tasks/${departmentId}/${userId}`}
            className="btn_hover text-sm font-medium"
          >
            Мои задачи
          </Link>

          <ProtectedByPermissions
            permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
          >
            <Link
              prefetch={false}
              href={`/dashboard/tasks/${departmentId}`}
              className="btn_hover text-sm font-medium"
            >
              Все задачи
            </Link>
          </ProtectedByPermissions>

          {!pathName?.includes("summary-table") && (
            <ProtectedByPermissions
              permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
            >
              <HoverCardComponent title="Сводные таблицы">
                {namePagesByDealType.map((type) => (
                  <div key={type} className="relative overflow-hidden rounded">
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

        <MobileMenu />
      </div>
    </header>
  );
}
