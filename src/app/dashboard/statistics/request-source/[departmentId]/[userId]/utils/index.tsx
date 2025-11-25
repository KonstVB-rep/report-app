import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import type { DateRange } from "react-day-picker"
import type { PieLabelRenderProps } from "recharts"
import type { Props as LabelProps } from "recharts/types/component/Label"

export const getPeriodRange = (period: "week" | "month" | "year"): DateRange => {
  const now = new Date()

  switch (period) {
    case "week":
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case "month":
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
      }
    case "year":
      return {
        from: startOfYear(now),
        to: endOfYear(now),
      }
  }
}

const isFromSite = (resource?: string) =>
  typeof resource === "string" &&
  (resource.endsWith(".ru") || resource.endsWith(".рф")) &&
  !resource.includes("@")

const normalizeResource = (resource: string): string =>
  resource
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .toLowerCase()

const dateFilter = (date: Date, filterValue?: DateRange): boolean => {
  const dateAtStartOfDay = startOfDay(date)

  if (filterValue) {
    const { from, to } = filterValue

    if (from && to) {
      return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= endOfDay(to)
    }

    if (from) {
      return dateAtStartOfDay >= startOfDay(from)
    }

    if (to) {
      return dateAtStartOfDay <= endOfDay(to)
    }

    return false
  }

  return true
}

const renderCustomizedLabel = (isDark: boolean) => {
  return (props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0, payload } = props

    const RADIAN = Math.PI / 180
    const radius = outerRadius + 30
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        dominantBaseline="central"
        fill={isDark ? "#ffffff" : "#111111"}
        fontSize={14}
        textAnchor={x > cx ? "start" : "end"}
        x={x}
        y={y}
      >
        <tspan dy="-0.6em" x={x}>
          {payload?.name}
        </tspan>
        <tspan dy="1.2em" x={x}>
          {`${(percent * 100).toFixed(0)}%`}
        </tspan>
      </text>
    )
  }
}

export { isFromSite, normalizeResource, dateFilter, renderCustomizedLabel }
