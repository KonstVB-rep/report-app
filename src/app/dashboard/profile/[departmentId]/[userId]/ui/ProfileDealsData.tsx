"use client"

import { type ReactNode, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import type { DateRange } from "@/entities/deal/types"
import { NOT_MANAGERS_POSITIONS_VALUES } from "@/entities/department/lib/constants"
import { useGetDealsByDateRange } from "@/feature/deals/api/hooks/query"
import { Button } from "@/shared/components/ui/button"
import { OverlayLocal } from "@/shared/custom-components/ui/Overlay"
import { formatterCurrency } from "@/shared/lib/utils"
import { DepartmentEnum } from "@/shared/types"

const dateRanges = [
  { name: "week", title: "неделя" },
  { name: "month", title: "месяц" },
  { name: "threeMonths", title: "три месяца" },
  { name: "halfYear", title: "полгода" },
  { name: "year", title: "год" },
]

const ProfileDealsData = ({ position }: { position: string }) => {
  const { userId, departmentId } = useParams<{
    userId: string
    departmentId: string
  }>()

  const departmentIdNumber = Number(departmentId)

  const params = useParams<{
    userId: string
    departmentId: string
  }>()

  const searchParams = useSearchParams()
  const router = useRouter()

  const dateRangeState = (searchParams.get("dateRange") as DateRange) || "week"

  const { data, isPending } = useGetDealsByDateRange(userId, dateRangeState, departmentIdNumber)

  useEffect(() => {
    if (params.departmentId === DepartmentEnum.MARKETING) {
      return
    }
    if (!searchParams.has("dateRange")) {
      router.replace(`?dateRange=week`, { scroll: false })
    }
  }, [searchParams, router, params.departmentId])

  if (NOT_MANAGERS_POSITIONS_VALUES.includes(position)) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <ToggleTimePeriod
        dateRangeState={dateRangeState}
        isPending={isPending}
        text="Сделки за период:"
      />
      <div className="relative">
        <OverlayLocal className="rounded-md opacity-100" isPending={isPending} />
        <div className="p-2 border flex flex-col gap-2 justify-around rounded-md">
          <div className="grid grid-cols-4 gap-2">
            <DealStatBadge label="Проекты" value={data?.projects?.length || 0} />
            <DealStatBadge label="Отказы" value={data?.projects?.reject || 0} />
            <DealStatBadge label="Оплачены" value={data?.projects?.paid || 0} />
            <DealStatBadge label="Закрыты" value={data?.projects?.closed || 0} />
          </div>
          <DealStatBadge
            label="Общая сумма КП:"
            value={
              isPending ? "" : formatterCurrency.format(Number(data?.projects?.money?.sumCp)) || 0
            }
          />
          <DealStatBadge
            label="Общая дельта:"
            value={isPending ? "" : formatterCurrency.format(Number(data?.projects.money.sumDelta))}
          />
        </div>
        <div className="p-2 border flex flex-col gap-2 justify-around rounded-md">
          <div className="grid grid-cols-4 gap-2">
            <DealStatBadge label="Розница" value={data?.retails?.length || 0} />
            <DealStatBadge label="Отказы" value={data?.retails?.reject || 0} />
            <DealStatBadge label="Оплачены" value={data?.retails?.paid || 0} />
            <DealStatBadge label="Закрыты" value={data?.retails?.closed || 0} />
          </div>
          <DealStatBadge
            label="Общая сумма КП:"
            value={
              isPending ? "" : formatterCurrency.format(Number(data?.retails?.money?.sumCp)) || 0
            }
          />
          <DealStatBadge
            label="Общая дельта:"
            value={isPending ? "" : formatterCurrency.format(Number(data?.retails.money.sumDelta))}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileDealsData

const ToggleTimePeriod = ({
  dateRangeState,
  isPending,
  text,
}: {
  dateRangeState: DateRange
  isPending: boolean
  text?: string
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const handleClick = (value: DateRange) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("dateRange", value)

    router.push(`?${params.toString()}`)
  }
  return (
    <>
      {text && <p className="p-2">{text}</p>}
      <div className="flex gap-1 justify-around">
        {dateRanges.map((item) => (
          <Button
            className={`${dateRangeState === item.name && "border-2 border-foreground border-solid disabled:opacity-70"}`}
            disabled={isPending}
            key={item.name}
            onClick={() => handleClick(item.name as DateRange)}
            variant="outline"
          >
            {item.title}
          </Button>
        ))}
      </div>
    </>
  )
}

type DealStatBadgeProps = {
  label: string
  value: ReactNode
  color?: "red" | "lime" | "green" | "default"
  children?: ReactNode
}

const DealStatBadge = ({ label, value, color = "default", children }: DealStatBadgeProps) => {
  const colorClass = {
    red: "shadow-[0_0_0_2px] shadow-red-600",
    lime: "shadow-[0_0_0_2px] shadow-lime-600",
    green: "shadow-[0_0_0_2px] shadow-green-800",
    default: "",
  }[color]
  return (
    <span className={`p-2 rounded-md bg-muted ${colorClass}`}>
      {children ?? (
        <>
          {label}: {value}
        </>
      )}
    </span>
  )
}
