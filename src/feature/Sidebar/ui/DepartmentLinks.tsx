"use client"

import { memo, useMemo } from "react"
import { PermissionEnum } from "@prisma/client"
import { BookText, ChartColumnBig, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { NOT_MANAGERS_POSITIONS } from "@/entities/department/lib/constants"
import type { DepartmentUserItem } from "@/entities/department/types"
import { Separator } from "@/shared/components/ui/separator"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"

// --- Типы ---
type DealsType = {
  id: string
  title: string
  resourcePath?: string
}

type DepartmentLinksProps = {
  departmentId: number
  user: DepartmentUserItem
  userId: string | undefined
  dealType?: string
  pathName?: string | null // pathName может быть null
}

// --- Константы ---
const dealsSalesDepartment: DealsType[] = [
  { id: "projects", title: "Проекты" },
  { id: "retails", title: "Розница" },
  { id: "contracts", title: "Договора" },
]

const pagesMarkretingDepartment: DealsType[] = [
  { id: "statistics/request-source", title: "Источники сделок" },
]

// --- Компонент одной ссылки (Типизированный) ---
const LinkItem = memo(
  ({
    href,
    title,
    icon: Icon,
    isActive,
    onClick,
  }: {
    href: string
    title: string
    icon: LucideIcon | React.ComponentType<{ size: number; className?: string }>
    isActive: boolean
    onClick: (e: React.MouseEvent) => void
  }) => (
    <>
      <Link
        className={`${
          !isActive && "text-primary dark:text-stone-400"
        } relative flex items-center gap-2 overflow-hidden rounded-md p-1 transition-all duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground`}
        href={href}
        onClick={onClick}
        prefetch={false}
      >
        <p className="relative z-1 flex h-full w-full items-center gap-2 rounded p-2">
          <Icon className="shrink-0" size={isActive ? 24 : 16} />
          {title}
        </p>
        {isActive && (
          <div className="absolute right-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-md bg-blue-600" />
        )}
      </Link>
      <Separator className="my-px h-px bg-stone-600" />
    </>
  ),
)
LinkItem.displayName = "LinkItem"

// --- Основной компонент ---
export const DepartmentLinks = memo(
  ({ departmentId, user, userId, dealType, pathName }: DepartmentLinksProps) => {
    const linksList = useMemo(() => {
      switch (departmentId) {
        case 1:
          return dealsSalesDepartment
        case 2:
          return pagesMarkretingDepartment
        default:
          return []
      }
    }, [departmentId])
    // 1. Guard clauses (Проверки ролей)
    if (user.position === NOT_MANAGERS_POSITIONS.DEVELOPER) return null
    // Если нужно раскомментировать ассистента - делай это здесь
    if (user.position === NOT_MANAGERS_POSITIONS.ASSISTANT_MANAGER) return null

    // 3. Рендер основных ссылок
    const renderLinks = linksList.map((link) => {
      const isActive = dealType === link.id && user.id === userId

      // Твоя оригинальная логика формирования URL
      const href =
        departmentId === 1
          ? `${user.url}/${link.id}/${user.id}`
          : `${user.url}/${departmentId}/${user.id}${link.resourcePath || ""}`

      return (
        <LinkItem
          href={href}
          icon={departmentId === 1 ? BookText : ChartColumnBig}
          isActive={isActive}
          key={link.id}
          onClick={(e) => e.stopPropagation()}
          title={link.title}
        />
      )
    })

    // 4. Доп. ссылка для маркетинга (ID 2)
    const marketingExtraLink =
      departmentId === 2 ? (
        <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
          <LinkItem
            href={`/dashboard/statistics/request-source/2/${user.id}/tabs`}
            icon={BookText}
            isActive={pathName?.includes("tabs") ?? false}
            onClick={(e) => e.stopPropagation()}
            title={"Заявки"}
          />
        </ProtectedByPermissions>
      ) : null

    return (
      <>
        {renderLinks}
        {marketingExtraLink}
      </>
    )
  },
)

DepartmentLinks.displayName = "DepartmentLinks"
