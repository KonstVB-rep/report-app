import { useEffect, useState } from "react"
import { PermissionEnum, type User } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"
import type { DateRange } from "@/entities/deal/types"
import { NOT_MANAGERS_POSITIONS_VALUES } from "@/entities/department/lib/constants"
import { useGetDealsByDateRange } from "@/feature/deals/api/hooks/query"
import { Button } from "@/shared/components/ui/button"
import { OverlayLocal } from "@/shared/custom-components/ui/Overlay"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { pageParamsSchemaDepsIsUserId, useTypedParams } from "@/shared/hooks/useTypedParams"
import { formatterCurrency } from "@/shared/lib/utils"

const dateRanges = [
  { name: "week", title: "неделя" },
  { name: "month", title: "месяц" },
  { name: "threeMonths", title: "три месяца" },
  { name: "halfYear", title: "полгода" },
  { name: "year", title: "год" },
]

const ProfileDealsData = ({ user }: { user: User }) => {
  const { userId, departmentId } = useTypedParams(pageParamsSchemaDepsIsUserId)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dateRangeState, setDateRangeState] = useState<DateRange>("week")

  const handleClick = (value: DateRange) => {
    setDateRangeState(value as DateRange)
    const params = new URLSearchParams(searchParams.toString())

    params.set("dateRange", value)

    router.push(`?${params.toString()}`)
  }

  const { data, isPending } = useGetDealsByDateRange(userId, dateRangeState, departmentId)

  const isPendingData = isPending

  useEffect(() => {
    const param = searchParams.get("dateRange") || "week"
    setDateRangeState(param as DateRange)
    router.push(`?dateRange=${param.toString()}`)
  }, [router, searchParams])

  if (NOT_MANAGERS_POSITIONS_VALUES.includes(user.position)) {
    return null
  }

  return (
    <ProtectedByPermissions permission={PermissionEnum.VIEW_UNION_REPORT}>
      <div className="flex flex-col gap-2">
        <p className="p-2">Сделки за период:</p>
        <div className="flex gap-1 justify-around">
          {dateRanges.map((item) => (
            <Button
              className={`${dateRangeState === item.name && "border-2 border-foreground border-solid disabled:opacity-70"}`}
              disabled={isPendingData}
              key={item.name}
              onClick={() => handleClick(item.name as DateRange)}
              variant="outline"
            >
              {item.title}
            </Button>
          ))}
        </div>
        <div className="relative">
          <OverlayLocal className="rounded-md opacity-100" isPending={isPendingData} />
          <div className="p-2 border flex flex-col gap-2 justify-around rounded-md">
            <div className="grid grid-cols-4 gap-2">
              <span className="p-2 rounded-md bg-muted">
                Проекты: {data?.projects?.length || 0}
              </span>
              <span className="p-2 rounded-md bg-muted border-red-600 border">
                Отказы: {data?.projects?.reject || 0}
              </span>
              <span className="p-2 rounded-md bg-muted border-lime-600 border">
                Оплачены: {data?.projects?.paid || 0}
              </span>
              <span className="p-2 rounded-md bg-muted border-green-800 border">
                Закрыты: {data?.projects?.closed || 0}
              </span>
            </div>
            <div className="p-2 rounded-md bg-muted">
              Общая сумма КП: {formatterCurrency.format(Number(data?.projects.money.sumCp))}
            </div>
            <div className="p-2 rounded-md bg-muted">
              Общая дельта: {formatterCurrency.format(Number(data?.projects.money.sumDelta))}
            </div>
          </div>
          <div className="p-2 border flex flex-col gap-2 justify-around rounded-md">
            <div className="grid grid-cols-4 gap-2">
              <span className="p-2 rounded-md bg-muted">Розница: {data?.retails?.length || 0}</span>
              <span className="p-2 rounded-md bg-muted border-red-600 border">
                Отказы: {data?.retails?.reject || 0}
              </span>
              <span className="p-2 rounded-md bg-muted border-lime-600 border">
                Оплачены: {data?.retails?.paid || 0}
              </span>
              <span className="p-2 rounded-md bg-muted border-green-800 border">
                Закрыты: {data?.retails?.closed || 0}
              </span>
            </div>
            <div className="p-2 rounded-md bg-muted">
              Общая сумма КП: {formatterCurrency.format(Number(data?.retails.money.sumCp))}
            </div>
            <div className="p-2 rounded-md bg-muted">
              Общая дельта: {formatterCurrency.format(Number(data?.retails.money.sumDelta))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedByPermissions>
  )
}

export default ProfileDealsData
