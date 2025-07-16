import { DateRange } from "react-day-picker";

import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import { RADIAN } from "../lib/constants";
import { CustomizedLabelProps } from "../types";

export const getPeriodRange = (
  period: "week" | "month" | "year"
): DateRange => {
  const now = new Date();

  switch (period) {
    case "week":
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "month":
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
      };
    case "year":
      return {
        from: startOfYear(now),
        to: endOfYear(now),
      };
  }
};

const isFromSite = (resource?: string) =>
  typeof resource === "string" &&
  (resource.endsWith(".ru") || resource.endsWith(".рф")) &&
  !resource.includes("@");

const normalizeResource = (resource: string): string =>
  resource
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .toLowerCase();

const dateFilter = (date: Date, filterValue?: DateRange): boolean => {
  const dateAtStartOfDay = startOfDay(date);

  if (filterValue) {
    const { from, to } = filterValue;

    if (from && to) {
      return (
        dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= endOfDay(to)
      );
    }

    if (from) {
      return dateAtStartOfDay >= startOfDay(from);
    }

    if (to) {
      return dateAtStartOfDay <= endOfDay(to);
    }

    return false;
  }

  return true;
};

const renderCustomizedLabel = (isDark: boolean) => {
  const Label = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    payload,
    width,
  }: CustomizedLabelProps & { width?: number }) => {
    const padding = 16;
    const dynamicRadius = Math.min(
      outerRadius + 30,
      (width ?? 600) / 2 - padding
    );

    const x = cx + dynamicRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + dynamicRadius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={isDark ? "#ffffff" : "#111111"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="text-after-edge"
        fontSize={14}
      >
        <tspan x={x} dy="0">
          {payload.name}
        </tspan>
        <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
    );
  };

  return Label;
};

export { isFromSite, normalizeResource, dateFilter, renderCustomizedLabel };
