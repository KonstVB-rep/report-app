"use client"

import { useEffect, useMemo, useState } from "react"
import { PermissionEnum } from "@prisma/client"
import { Tabs } from "@radix-ui/react-tabs"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { TableType } from "@/entities/deal/types"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"

interface MarketingDealsTableProps {
  userId: string
}

const MarketingDealsTable = ({ userId }: MarketingDealsTableProps) => {
  const [activeTab, setActiveTab] = useState<TableType>("retails")

  const hasAccess = useMemo(
    () => hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT),
    [userId],
  )

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTabMarketing")
    if (savedTab) {
      setActiveTab(savedTab as TableType)
    }
  }, [])

  const handleToggleTab = (v: TableType) => {
    localStorage.setItem("activeTabMarketing", v)
    setActiveTab(v)
  }

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  return (
    <Tabs onValueChange={(v) => handleToggleTab(v as TableType)} value={activeTab}>
      {/* tabs */}
    </Tabs>
  )
}

export default MarketingDealsTable
