"use client"

import { DealType, PermissionEnum } from "@prisma/client"
import { CalendarClock, SidebarIcon } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SummaryTableLink from "@/entities/deal/ui/SummaryTableLink"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { Button } from "@/shared/components/ui/button"
import { ModeToggle } from "@/shared/components/ui/mode-toggle"
import { Separator } from "@/shared/components/ui/separator"
import { useSidebar } from "@/shared/components/ui/sidebar"
import HoverCardComponent from "@/shared/custom-components/ui/HoverCard"
import Logo from "@/shared/custom-components/ui/Logo"
import MobileMenu from "@/shared/custom-components/ui/MobileMenu"

const ProtectedByPermissions = dynamic(
  () => import("@/shared/custom-components/ui/Protect/ProtectedByPermissions"),
  { ssr: false },
)

const namePagesByDealType = [DealType.PROJECT, DealType.RETAIL]

export function SiteHeader({ isHasSitebar = true }: { isHasSitebar?: boolean }) {
  const { authUser } = useStoreUser()
  const { toggleSidebar } = useSidebar()
  const pathName = usePathname()

  const userId = authUser?.id
  const departmentId = authUser?.departmentId

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background border-border">
      <div className="flex h-(--header-height) items-center justify-between gap-2 px-4">
        {isHasSitebar ? (
          <div className="flex items-center gap-4">
            <Button
              aria-label="Открыть/закрыть боковую панель"
              className="h-8 w-8"
              onClick={toggleSidebar}
              size="icon"
              variant="ghost"
            >
              <SidebarIcon />
            </Button>
            <Separator className="mr-2 h-4" orientation="vertical" />
          </div>
        ) : (
          <div className="hover:scale-125 transition-all duration-200">
            <Logo href="/dashboard" isTitle={false} title="На главную" />
          </div>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <Link
            className="btn_hover text-sm font-medium"
            href={`/dashboard/tasks/${departmentId}/${userId}`}
            prefetch={false}
          >
            Мои задачи
          </Link>

          <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
            <Link
              className="btn_hover text-sm font-medium"
              href={`/dashboard/tasks/${departmentId}`}
              prefetch={false}
            >
              Все задачи
            </Link>
          </ProtectedByPermissions>

          {!pathName?.includes("summary-table") && (
            <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
              <HoverCardComponent title="Сводные таблицы">
                {namePagesByDealType.map((type) => (
                  <div className="relative overflow-hidden rounded" key={type}>
                    <SummaryTableLink className="btn_hover" departmentId="1" type={type} />
                  </div>
                ))}
              </HoverCardComponent>
            </ProtectedByPermissions>
          )}

          <Button asChild className="h-12 w-12" variant="outline">
            <Link href={`/dashboard/calendar/${userId}`} title="Календарь">
              <CalendarClock />
            </Link>
          </Button>

          <ModeToggle />
        </div>

        <MobileMenu />
      </div>
    </header>
  )
}
