"use client"

import Link from "next/link"
import { DEAL_TYPE, type DealType } from "@/entities/deal/types"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import { PERMISSIONS } from "@/shared/lib/constants"

type Props = {
  type: DealType
  className?: string
  departmentId?: string
  protect?: boolean
}

const SummaryTableLink = ({ type, className = "", departmentId, protect = true }: Props) => {
  const authUser = useRequireAuth()

  const departmentIdValue = departmentId !== undefined ? departmentId : authUser.departmentId

  const href = `/dashboard/summary-table/${departmentIdValue}/${type.toLowerCase()}s/${authUser.id}`

  const LinkComponent = () => (
    <Link
      className={`${className} min-w-full max-w-max text-sm`}
      href={href}
      title="перейти на страницу сводной таблицы"
    >
      <span className="first-letter:capitalize">
        {DEAL_TYPE[type as keyof typeof DEAL_TYPE] as string}
      </span>
    </Link>
  )

  return protect ? (
    <ProtectedByPermissions permission={PERMISSIONS.VIEW_UNION_REPORT}>
      <LinkComponent />
    </ProtectedByPermissions>
  ) : (
    <LinkComponent />
  )
}

export default SummaryTableLink
