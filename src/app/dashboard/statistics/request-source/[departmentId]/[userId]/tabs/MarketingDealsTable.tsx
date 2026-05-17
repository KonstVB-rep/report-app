"use client"

import { Activity, Suspense, useEffect, useMemo, useState } from "react" // 1. Импортируем Activity и Suspense
import { PermissionEnum } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData"
import type { DealsUnionType } from "@/entities/deal/types"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs" // TabsContent НЕ импортируем
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
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
  amountWork: false,
  direction: false,
  deliveryType: false,
}
const hiddenColsRetail = {
  id: false,
  plannedDateConnection: false,
  direction: false,
  deliveryType: false,
}

interface MarketingDealsTableProps {
  userId: string
}

const typesTab: Record<DealsUnionType, DealsUnionType> = {
  retails: "retails",
  projects: "projects",
}

const MarketingDealsTable = ({ userId }: MarketingDealsTableProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryTab = searchParams.get("typeTab") as DealsUnionType | null

  const [activeTab, setActiveTab] = useState<DealsUnionType>(queryTab || "retails")

  const hasAccess = useMemo(
    () => hasAccessToDataSummary(userId, PermissionEnum.VIEW_UNION_REPORT),
    [userId],
  )

  useEffect(() => {
    if (!queryTab) {
      setActiveTab(typesTab.retails)
      const params = new URLSearchParams(searchParams.toString())
      params.set("typeTab", typesTab.retails)

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      })
    } else if (queryTab) {
      setActiveTab(queryTab)
    }
  }, [pathname, queryTab, router.replace, searchParams.toString])

  const handleToggleTab = (value: DealsUnionType) => {
    setActiveTab(value)

    const params = new URLSearchParams()

    params.set("typeTab", value)

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  if (!hasAccess) {
    return <AccessDeniedMessage error={{ message: "у вас нет доступа к этому разделу" }} />
  }

  return (
    <Tabs onValueChange={(v) => handleToggleTab(v as DealsUnionType)} value={activeTab}>
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
