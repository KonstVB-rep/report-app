"use client"

import { Activity, Suspense, useEffect, useMemo, useState } from "react" // 1. Импортируем Activity и Suspense
import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import z from "zod"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { TableType } from "@/entities/deal/types"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs" // TabsContent НЕ импортируем
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import { columnsDataProjectForMarketing } from "@/widgets/deal/model/columns-data-project-for-marketing"
import { columnsDataRetailForMarketing } from "@/widgets/deal/model/columns-data-retail-for-marketing"

const DealsTabContent = dynamic(() => import("../ui/DealsTabContent"), {
  ssr: false,
})

export interface SummaryTableProps<T extends { id: string }> {
  columns: ColumnDef<T, unknown>[]
}

const hiddenColsProject = {
  id: false,
  contact: false,
  phone: false,
  email: false,
  amountWork: false,
  amountPurchase: false,
  delta: false,
  plannedDateConnection: false,
  direction: false,
  deliveryType: false,
  user: false,
}
const hiddenColsRetail = {
  id: false,
  contact: false,
  phone: false,
  email: false,
  delta: false,
  plannedDateConnection: false,
  direction: false,
  deliveryType: false,
  user: false,
}

const pageParamsSchema = z.object({
  userId: z.string(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => value as DepartmentsUnionIds),
})

const MarketingDealsTable = () => {
  const { userId } = useTypedParams(pageParamsSchema)
  const [activeTab, setActiveTab] = useState<TableType>("retails")

  const hasAccess = useMemo(
    () => (userId ? hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT) : false),
    [userId],
  )

  const handleToggleTab = (v: TableType) => {
    localStorage.setItem("activeTabMarketing", v)
    setActiveTab(v as TableType)
  }

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTabMarketing")
    if (savedTab) {
      setActiveTab(savedTab as TableType)
    }
  }, [])

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  return (
    <Tabs className="pt-5" onValueChange={(v) => handleToggleTab(v as TableType)} value={activeTab}>
      <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
        <TabsTrigger value="retails">Розница</TabsTrigger>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
      </TabsList>

      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Activity mode={activeTab === "retails" ? "visible" : "hidden"}>
          <Suspense fallback={<LoaderCircleInWater />}>
            <DealsTabContent
              columns={columnsDataRetailForMarketing}
              dealType="retails"
              departmentId={1}
              hasAccess={hasAccess}
              hiddenColumns={hiddenColsRetail}
              userId={userId}
            />
          </Suspense>
        </Activity>

        <Activity mode={activeTab === "projects" ? "visible" : "hidden"}>
          <Suspense fallback={<LoaderCircleInWater />}>
            <DealsTabContent
              columns={columnsDataProjectForMarketing}
              dealType="projects"
              departmentId={1}
              hasAccess={hasAccess}
              hiddenColumns={hiddenColsProject}
              userId={userId}
            />
          </Suspense>
        </Activity>
      </div>
    </Tabs>
  )
}

export default MarketingDealsTable
