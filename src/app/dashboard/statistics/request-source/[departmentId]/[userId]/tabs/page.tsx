"use client"

import { useMemo, useState } from "react"
import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import z from "zod"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { TableType } from "@/entities/deal/types"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard"
import { columnsDataProjectForMarketing } from "@/widgets/deal/model/columns-data-project-for-marketing"
import { columnsDataRetailForMarketing } from "@/widgets/deal/model/columns-data-retail-for-marketing"
import DealsTabContent from "../ui/DealsTabContent"

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
    .transform((value) => {
      return value as DepartmentsUnionIds
    }),
})

const MarketingDealsTable = () => {
  const { userId } = useTypedParams(pageParamsSchema)

  const [activeTab, setActiveTab] = useState<TableType>("retails")

  const hasAccess = useMemo(
    () => (userId ? hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT) : false),
    [userId],
  )

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  return (
    <Tabs className="pt-5" onValueChange={(v) => setActiveTab(v as TableType)} value={activeTab}>
      <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
        <TabsTrigger value="retails">Розница</TabsTrigger>
        <TabsTrigger value="projects">Проекты</TabsTrigger>
      </TabsList>

      <TabsContent value="retails">
        <DealsTabContent
          columns={columnsDataRetailForMarketing}
          dealType="retails"
          departmentId={1}
          hasAccess={hasAccess}
          hiddenColumns={hiddenColsRetail}
          userId={userId}
        />
      </TabsContent>

      <TabsContent value="projects">
        <DealsTabContent
          columns={columnsDataProjectForMarketing}
          dealType="projects"
          departmentId={1}
          hasAccess={hasAccess}
          hiddenColumns={hiddenColsProject}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  )
}

export default withAuthGuard(MarketingDealsTable)
