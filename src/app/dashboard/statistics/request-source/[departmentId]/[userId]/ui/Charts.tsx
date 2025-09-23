"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { useRouter, useSearchParams } from "next/navigation";

import { ChartColumnBig, ChartPie, X } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { StatusesInWork } from "@/feature/deals/lib/constants";
import { Button } from "@/shared/components/ui/button";
import { DateRangePicker } from "@/shared/components/ui/date-range-picker";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";
import useAnimateOnDataChange from "@/shared/hooks/useAnimateOnDataChange";
import useCurrentTheme from "@/shared/hooks/useCurrentTheme";

import { COLORS } from "../lib/constants";
import { Props } from "../types";
import {
  dateFilter,
  getPeriodRange,
  isFromSite,
  normalizeResource,
  renderCustomizedLabel,
} from "../utils";
import EmptyData from "./EmptyData";
import Graph from "./Graph";
import MobileCharts from "./MobileCharts";
import ResourceRow from "./ResourceRow";

type StatusGroup = "inWork" | "positive" | "negative";

type CountItem = Record<string, Record<StatusGroup, number>>;

type DateRangeParams = "week" | "month" | "year";

const emptyResourceKey = "Другое";

const defaultValuesCount = () => ({
  inWork: 0,
  positive: 0,
  negative: 0,
});

const Charts = ({ data: { deals, totalDealsCount } }: Props) => {
  const isDarkMode = useCurrentTheme();
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dateRangeState, setDateRangeState] = useState<DateRangeParams | null>(
    null
  );
  const [typeDataDisplay, setTypeDataDisplay] = useState<string>("");

  const isGraph = typeDataDisplay === "graph";
  const isCircleGraph = typeDataDisplay === "circle";

  const { data, countsStatuses } = useMemo(() => {
    const countsStatuses: CountItem = {};
    const filteredDate = deals.filter(({ dateRequest }) =>
      dateFilter(dateRequest, selectedDate)
    );

    if (filteredDate.length === 0) return { data: [], countsStatuses };

    filteredDate.forEach(({ resource, dealStatus }) => {
      const key = isFromSite(resource)
        ? normalizeResource(resource)
        : emptyResourceKey;
      countsStatuses[key] ??= defaultValuesCount();

      if (dealStatus in StatusesInWork) {
        countsStatuses[key].inWork++;
      } else if (["PAID", "CLOSED"].includes(dealStatus)) {
        countsStatuses[key].positive++;
      } else if (dealStatus === "REJECT") {
        countsStatuses[key].negative++;
      }
    });

    const data = Object.entries(countsStatuses).map(([name, statusCounts]) => ({
      name,
      value:
        statusCounts.inWork + statusCounts.positive + statusCounts.negative,
    }));

    return { data, countsStatuses };
  }, [deals, selectedDate]);

  const shouldRender = useAnimateOnDataChange(data);

  const dataCountByDate = data.reduce((acc, item) => (acc += item.value), 0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>, obj: DateRange) => {
    const id = e.currentTarget.id as DateRangeParams;
    setSelectedDate(obj);
    setDateRangeState(id);

    const params = new URLSearchParams(searchParams);
    params.set("dateRange", id);
    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    const param = searchParams.get("dateRange") as DateRangeParams | null;
    const displayType = searchParams.get(
      "displayType"
    ) as DateRangeParams | null;
    if (param) {
      setDateRangeState(param);
      setSelectedDate(getPeriodRange(param));
    }
    setTypeDataDisplay(displayType || "circle");
  }, [searchParams]);

  const handleChoiceDataDisplay: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    const type = e.currentTarget.id;
    setTypeDataDisplay(type);
    const params = new URLSearchParams(searchParams);
    params.set("displayType", type);
    router.replace(`?${params.toString()}`);
  };

  if (deals.length === 0) return <EmptyData />;

  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-semibold text-center">
        Статистика заявок по источникам
      </h1>
      <div className="flex gap-2 items-start justify-between">
        <h2 className="text-lg flex gap-2 p-2 items-center w-fit font-semibold border border-solid border-primary dark:border-muted rounded-md">
          <span>Количество заявок: </span>
          <span className="grid place-items-center aspect-square p-2 border border-solid rounded-md ">
            {totalDealsCount}
          </span>
        </h2>
        <div className="flex gap-2">
          <Button
            id="circle"
            variant={isCircleGraph ? "default" : "outline"}
            onClick={handleChoiceDataDisplay}
            size={"icon"}
            title="Круговая диаграмма"
          >
            <ChartPie />
          </Button>
          <Button
            id="graph"
            variant={isGraph ? "default" : "outline"}
            onClick={handleChoiceDataDisplay}
            size={"icon"}
            title="График"
          >
            <ChartColumnBig />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 justify-between items-end flex-wrap">
        <div className="grid gap-2">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={(e) => handleClick(e, getPeriodRange("week"))}
              className={`btn-active ${dateRangeState === "week" && "border-2 border-primary"}`}
              id="week"
            >
              Неделя
            </Button>
            <Button
              variant="outline"
              onClick={(e) => handleClick(e, getPeriodRange("month"))}
              className={`btn-active ${dateRangeState === "month" && "border-2 border-primary"}`}
              id="month"
            >
              Месяц
            </Button>
            <Button
              variant="outline"
              onClick={(e) => handleClick(e, getPeriodRange("year"))}
              className={`btn-active ${dateRangeState === "year" && "border-2 border-primary"}`}
              id="year"
            >
              Год
            </Button>
          </div>

          <div>
            <p className="p-2 border rounded-md w-fit">
              За период: {dataCountByDate}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <DateRangePicker
            value={selectedDate}
            onValueChange={setSelectedDate}
          />
          {selectedDate && (
            <Button
              aria-label="Сбросить дату"
              variant="outline"
              onClick={() => setSelectedDate(undefined)}
            >
              <X />
            </Button>
          )}
        </div>
      </div>

      {shouldRender && (
        <div>
          {data.length > 0 ? (
            <MotionDivY
              keyValue={`chart-${JSON.stringify(selectedDate)}`}
              className="grid-charts gap-4 items-center"
            >
              {isCircleGraph && (
                <ResponsiveContainer
                  width={640}
                  minWidth={480}
                  height={420}
                  className="hidden sm:block justify-self-center w-full h-auto"
                >
                  <PieChart>
                    <Pie
                      minAngle={10}
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      outerRadius={140}
                      labelLine
                      label={renderCustomizedLabel(isDarkMode)}
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
              )}

              {isGraph && (
                <Graph data={data} className="block w-full h-[430px]" />
              )}

              <MobileCharts data={data} />

              <div className="flex gap-2 w-full md:w-auto flex-1 min-w-max">
                <ul className="grid gap-2 shrink-0 flex-1">
                  {data.map((item, index) => (
                    <ResourceRow
                      key={item.name}
                      item={item}
                      color={COLORS[index % COLORS.length]}
                      status={countsStatuses[item.name]}
                    />
                  ))}
                </ul>

                <ul className="hidden sm:grid gap-2 shrink-0">
                  {data.map((item, index) => (
                    <li
                      key={index}
                      className="grid grid-cols-4 gap-2 items-center"
                    >
                      <span className="py-1 px-2 bg-muted border border-solid rounded-md border-primary dark:border-muted flex items-center justify-center">
                        {item.value}
                      </span>
                      <TooltipComponent content={"Оплачен/Закрыт"}>
                        <span className="py-1 px-2 border-solid rounded-md flex items-center justify-center border-green-600 border-2">
                          {countsStatuses[item.name].positive}
                        </span>
                      </TooltipComponent>

                      <TooltipComponent content={"Не актуально/Отказ"}>
                        <span className="py-1 px-2 border-solid rounded-md flex items-center justify-center border-red-600 border-2">
                          {countsStatuses[item.name].negative}
                        </span>
                      </TooltipComponent>

                      <TooltipComponent content={"Актуально/В работе"}>
                        <span className="py-1 px-2 border-solid rounded-md flex items-center justify-center border-blue-600 border-2">
                          {countsStatuses[item.name].inWork}
                        </span>
                      </TooltipComponent>
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
    </div>
  );
};

export default Charts;
