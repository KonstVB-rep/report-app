"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { DateRange } from "react-day-picker"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { v4 as uuid } from "uuid"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import useAnimateOnDataChange from "@/shared/hooks/useAnimateOnDataChange"
import useCurrentTheme from "@/shared/hooks/useCurrentTheme"
import { COLORS } from "../lib/constants"
import type { Props } from "../types"
import {
  dateFilter,
  getPeriodRange,
  isFromSite,
  normalizeResource,
  renderCustomizedLabel,
} from "../utils"
import DateFilters from "./DateFilters"
import DisplayTypeSwitch from "./DisplayTypeSwitch"
import EmptyData from "./EmptyData"
import Graph from "./Graph"
import MobileCharts from "./MobileCharts"
import ResourceRow from "./ResourceRow"

type CountItem = Record<string, number>
type DateRequestsType = Record<string, string[]>

type DateRangeParams = "week" | "month" | "year"

const emptyResourceKey = "Другое"

const Charts = ({ data: { deals, totalDealsCount } }: Props) => {
  const isDarkMode = useCurrentTheme()
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dateRangeState, setDateRangeState] = useState<DateRangeParams | null>(null)
  const [typeDataDisplay, setTypeDataDisplay] = useState<string>("")

  const isGraph = typeDataDisplay === "graph"
  const isCircleGraph = typeDataDisplay === "circle"

  const { data } = useMemo(() => {
    const countsStatuses: CountItem = {}
    const dateRequests: DateRequestsType = {}

    const filteredDate = deals.filter(({ dateRequest }) => dateFilter(dateRequest, selectedDate))

    if (filteredDate.length === 0) return { data: [], countsStatuses }

    filteredDate.forEach(({ resource, dateRequest }) => {
      const key = isFromSite(resource) ? normalizeResource(resource) : emptyResourceKey
      if (!dateRequests[key]) {
        dateRequests[key] = []
      }

      const dateString =
        typeof dateRequest === "string" ? dateRequest : dateRequest.toLocaleDateString("ru-RU")

      dateRequests[key].push(dateString)
      countsStatuses[key] = (countsStatuses[key] || 0) + 1
    })

    const data = Object.entries(countsStatuses).map(([name, statusCounts]) => ({
      name,
      value: statusCounts,
      dateRequets: dateRequests[name],
    }))

    console.log(data, "data")

    return { data, countsStatuses }
  }, [deals, selectedDate])

  const shouldRender = useAnimateOnDataChange(data)

  useEffect(() => {
    const param = searchParams.get("dateRange") as DateRangeParams | null
    const displayType = searchParams.get("displayType") as DateRangeParams | null
    if (param) {
      setDateRangeState(param)
      setSelectedDate(getPeriodRange(param))
    }
    setTypeDataDisplay(displayType || "circle")
  }, [searchParams])

  const handleChangeDateRange = (range: DateRange | undefined, id?: DateRangeParams) => {
    setSelectedDate(range)
    if (id) {
      setDateRangeState(id)
      const params = new URLSearchParams(searchParams)
      params.set("dateRange", id)
      router.replace(`?${params.toString()}`)
    }
  }

  const handleDisplayChange = (type: string) => {
    setTypeDataDisplay(type)
    const params = new URLSearchParams(searchParams)
    params.set("displayType", type)
    router.replace(`?${params.toString()}`)
  }

  if (deals.length === 0) return <EmptyData />

  return (
    <div className="grid gap-3">
      <TitlePageBlock
        infoText="Статистика заявок по источникам"
        subTitle={`Количество заявок: ${totalDealsCount}`}
        title="Статистика заявок"
      />
      <div className="px-4 py-2 border rounded-md w-fit">Выбранные за период: {data.length}</div>
      <div className="flex gap-2 items-start justify-between">
        <DateFilters
          dateRangeState={dateRangeState}
          onChange={handleChangeDateRange}
          selectedDate={selectedDate}
        />
        <DisplayTypeSwitch activeType={typeDataDisplay} onChange={handleDisplayChange} />
      </div>

      {shouldRender && (
        <div>
          {data.length > 0 ? (
            <MotionDivY
              className="grid-charts grid gap-2 sm:gap-4 items-start pt-20"
              keyValue={`chart-${JSON.stringify(selectedDate)}`}
            >
              {isCircleGraph && (
                <ResponsiveContainer
                  className="hidden sm:block justify-self-center"
                  height="100%"
                  minHeight={480}
                  minWidth={480}
                  width="100%"
                >
                  <PieChart>
                    <Pie
                      cx="40%"
                      cy="50%"
                      data={data}
                      dataKey="value"
                      label={renderCustomizedLabel(isDarkMode)}
                      labelLine
                      minAngle={10}
                      nameKey="name"
                      outerRadius={140}
                    >
                      {data.map((_, index) => (
                        <Cell fill={COLORS[index % COLORS.length]} key={`cell-${uuid()}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {isGraph && <Graph className="w-full h-[430px] hidden sm:block" data={data} />}

              <MobileCharts data={data} />

              <div className="flex gap-2 w-full md:w-auto flex-1 min-w-max">
                <ul className="grid gap-2 shrink-0 flex-1">
                  {data.map((item, index) => (
                    <ResourceRow
                      color={COLORS[index % COLORS.length]}
                      item={item}
                      key={item.name}
                    />
                  ))}
                </ul>

                <ul className="hidden sm:grid gap-2 shrink-0">
                  {data.map((item) => (
                    <li className="shrink-0" key={uuid()}>
                      <span className="py-1 px-2 bg-muted border border-solid rounded-md border-primary dark:border-muted flex items-center justify-center shrink-0">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionDivY>
          ) : (
            <MotionDivY keyValue="empty">
              <EmptyData />
            </MotionDivY>
          )}
        </div>
      )}

      {/* <CustomizedLabelLineChart data={data} /> */}
    </div>
  )
}

export default Charts
