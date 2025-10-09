"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { useRouter, useSearchParams } from "next/navigation";

import { ChartColumnBig, ChartPie, X } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { StatusesInWork } from "@/feature/deals/lib/constants";
import { Button } from "@/shared/components/ui/button";
import { DateRangePicker } from "@/shared/components/ui/date-range-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage";
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
    <div className="grid gap-3">
      <TitlePageBlock
        title="Статистика заявок"
        subTitle={`Количество заявок: ${totalDealsCount}`}
        infoText="Статистика заявок по источникам"
      />
      <div className="flex gap-2 items-start justify-between">
        <div className="hidden gap-2 flex-wrap sm:flex">
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
        <div className="gap-2 hidden sm:flex">
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
      <div className="flex gap-2 justify-between items-center flex-wrap">
        <div>
          <p className="p-2 border rounded-md w-fit">
            За период: {dataCountByDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="block sm:hidden">
                Период
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2">
              <div className="grid gap-2 flex-wrap">
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
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 flex-wrap w-full xs:w-auto">
          <DateRangePicker
            value={selectedDate}
            onValueChange={setSelectedDate}
            label="Дата"
          />
          {selectedDate && (
            <Button
              aria-label="Сбросить дату"
              variant="outline"
              onClick={() => setSelectedDate(undefined)}
              className="flex-1"
            >
              <X className="hidden xs:block" />
              <span className="p-2 flex items-center justify-center xs:hidden">
                Сбросить даты
              </span>
            </Button>
          )}
        </div>
      </div>

      {shouldRender && (
        <div>
          {data.length > 0 ? (
            <MotionDivY
              keyValue={`chart-${JSON.stringify(selectedDate)}`}
              className="grid-charts gap-2 sm:gap-4 items-center"
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
                <Graph
                  data={data}
                  className="w-full h-[430px] hidden sm:block"
                />
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
                      className="grid grid-cols-4 gap-2 items-center shrink-0"
                    >
                      <span className="py-1 px-2 bg-muted border border-solid rounded-md border-primary dark:border-muted flex items-center justify-center shrink-0">
                        {item.value}
                      </span>
                      <TooltipComponent content={"Оплачен/Закрыт"}>
                        <span className="py-1 px-2 border-solid rounded-md flex items-center justify-center border-green-600 border-2 shrink-0">
                          {countsStatuses[item.name].positive}
                        </span>
                      </TooltipComponent>

                      <TooltipComponent content={"Не актуально/Отказ"}>
                        <span className="py-1 px-2 border-solid rounded-md flex items-center justify-center border-red-600 border-2 shrink-0">
                          {countsStatuses[item.name].negative}
                        </span>
                      </TooltipComponent>

                      <TooltipComponent content={"Актуально/В работе"}>
                        <span className="py-1 px-2 border-solid rounded-md flex items-center justify-center border-blue-600 border-2 shrink-0">
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
