"use client"

import { useMemo, useState } from "react"
import { Redo2 } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import type { DepartmentLabelsById } from "@/entities/department/lib/constants"
import Overlay from "@/shared/custom-components/ui/Overlay"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import { PERMISSIONS } from "@/shared/lib/constants"
import type { DealsUnionType, DealType } from "../types"

const linksPersonTable = (deptId: string | number) => ({
  retails: {
    title: "Проекты",
    url: `/table/${deptId}/projects`,
  },
  projects: {
    title: "Розничные сделки",
    url: `/table/${deptId}/retails`,
  },
})

const linksSummaryTable = (deptId: string | number) => ({
  retails: {
    title: "Проекты/Сводная таблица",
    url: `/summary-table/${deptId}/projects`,
  },
  projects: {
    title: "Розничные сделки/Сводная таблица",
    url: `/summary-table/${deptId}/retails`,
  },
})

const LinkToUserTable = () => {
  const { departmentId, dealType, userId } = useParams<{
    departmentId: keyof typeof DepartmentLabelsById
    userId: string
    dealType: DealType
  }>()

  const authUser = useRequireAuth()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => setIsLoading(true)

  const hasTable = useMemo(() => {
    if (!dealType || !userId || !departmentId) return null
    if (!pathname.includes(`/table/${departmentId}/${dealType}/${userId}`)) return null
    return linksPersonTable(departmentId as string)[dealType as DealsUnionType]
  }, [pathname, dealType, departmentId, userId])

  const hasSummaryTable = useMemo(() => {
    if (!authUser || !dealType) return null
    if (!pathname.includes(`/summary-table/${authUser.departmentId}/${dealType}/${authUser.id}`))
      return null
    return linksSummaryTable(authUser.departmentId)[dealType as DealsUnionType]
  }, [pathname, dealType, authUser])

  return (
    <>
      <Overlay className="animate animate-pulse" isPending={isLoading} />
      {hasTable && (
        <Link
          className="btn_hover max-w-max border-muted px-4 text-sm"
          href={`/dashboard/${hasTable.url}/${userId}`}
          onClick={handleClick}
          prefetch={false}
          title={`Перейти на страницу - ${hasTable.title}`}
        >
          {hasTable.title} <Redo2 size={14} />
        </Link>
      )}

      {hasSummaryTable && (
        <ProtectedByPermissions permission={PERMISSIONS.VIEW_UNION_REPORT}>
          <Link
            className="btn_hover max-w-max border-muted px-4 text-sm"
            href={`/dashboard/${hasSummaryTable.url}/${authUser.id}`}
            onClick={handleClick}
            prefetch={false}
            title={`Перейти на страницу - ${hasSummaryTable.title}`}
          >
            {hasSummaryTable.title} <Redo2 size={14} />
          </Link>
        </ProtectedByPermissions>
      )}
    </>
  )
}

export default LinkToUserTable
