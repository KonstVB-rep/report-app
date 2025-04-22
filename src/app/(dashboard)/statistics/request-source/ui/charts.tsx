"use client";

import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";

import { COLORS } from "../lib/constants";
import { Props } from "../types";
import {
  dateFilter,
  getPeriodRange,
  isFromSite,
  normalizeResource,
  renderCustomizedLabel,
} from "../utils";
import EmptyData from "./emptyData";
import MobileCharts from "./MobileCharts";

const RequestsPerSitePieChart = ({
  data: { deals, totalDealsCount },
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();

  const data = useMemo(() => {
    const counts: Record<string, number> = {};

    const filteredDate = deals.filter(({ dateRequest }) =>
      dateFilter(dateRequest, selectedDate)
    );

    if (filteredDate.length === 0) return [];

    const dealsByNotSites = filteredDate.filter(
      ({ resource }) => !resource?.endsWith(".ru") || !resource?.endsWith(".рф")
    );

    const dealsByNotSitesFilteredDate = dealsByNotSites.filter(
      ({ dateRequest }) => dateFilter(dateRequest, selectedDate)
    );

    filteredDate.forEach(({ resource }) => {
      if (isFromSite(resource)) {
        const key = normalizeResource(resource);
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    const totalData = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));

    return [
      ...totalData,
      {
        name: "Другие источники",
        value:
          dealsByNotSitesFilteredDate.length -
          totalData.reduce((acc, item) => acc + item.value, 0),
      },
    ];
  }, [deals, selectedDate]);

  console.log(data, "data");

  if (deals.length === 0) return <EmptyData />;

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-semibold text-center">Статистика заявок</h1>
      <h2 className="text-lg p-2 px-4 w-fit font-semibold border border-solid border-primary dark:border-muted rounded-md">
        Общее количество заявок: {totalDealsCount}
      </h2>
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setSelectedDate(getPeriodRange("week"))}
            className="btn-active"
          >
            Неделя
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedDate(getPeriodRange("month"))}
            className="btn-active"
          >
            Месяц
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedDate(getPeriodRange("year"))}
            className="btn-active"
          >
            Год
          </Button>
        </div>

        <div className="flex gap-2">
          <DateRangePicker
            value={selectedDate}
            onValueChange={setSelectedDate}
          />
          {selectedDate && (
            <Button
              variant="outline"
              onClick={() => setSelectedDate(undefined)}
            >
              <X />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {data.length > 0 ? (
          <MotionDivY
            keyValue={`chart-${JSON.stringify(selectedDate)}`}
            className="grid md:grid-cols-[auto_1fr] gap-5 items-center pt-5"
          >
            <div className="flex gap-5 p-2">
              <ul className="grid gap-2">
                {data.map((item, index) => (
                  <li key={index} className="flex gap-4 items-center">
                    <span className="py-1 px-2 border border-solid rounded-md" style={{borderColor: COLORS[index]}}>
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <ul className="grid gap-2">
                {data.map((item, index) => (
                  <li key={index} className="flex gap-4 items-center">
                    <span className="py-1 px-2 border border-solid rounded-md border-primary dark:border-muted">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ResponsiveContainer width="100%" height={400} className="min-w-[300px] hidden md:block justify-self-center">
              <PieChart>
                <Pie
                  minAngle={10}
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  labelLine
                  label={renderCustomizedLabel}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <MobileCharts data={data} />
          </MotionDivY>
        ) : (
          <MotionDivY keyValue="empty">
            <EmptyData />
          </MotionDivY>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestsPerSitePieChart;
