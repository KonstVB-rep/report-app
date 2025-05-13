import { DealType } from "@prisma/client";

import { useEffect, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetDealsByDateRange } from "@/entities/deal/hooks/query";
import { DateRange } from "@/entities/deal/types";

const dateRanges = [
  { name: "week", title: "неделя" },
  { name: "month", title: "месяц" },
  { name: "threeMonths", title: "три месяца" },
  { name: "halfYear", title: "полгода" },
  { name: "year", title: "год" },
];

const ProfileDealsData = () => {
  const { userId, departmentId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dateRangeState, setDateRangeState] = useState<DateRange>("week");

  const handleClick = (value: DateRange) => {
    setDateRangeState(value as DateRange);
    const params = new URLSearchParams(searchParams.toString());

    params.set("dateRange", value);

    router.push(`?${params.toString()}`);
  };

  const { data: projectsCount } = useGetDealsByDateRange(
    userId as string,
    dateRangeState,
    DealType.PROJECT,
    departmentId as string
  );
  const { data: retailsCount } = useGetDealsByDateRange(
    userId as string,
    dateRangeState,
    DealType.RETAIL,
    departmentId as string
  );

  useEffect(() => {
    const param = searchParams.get("dateRange") || "week";
    setDateRangeState(param as DateRange);
    router.push(`?dateRange=${param.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col gap-2">
      <p className="p-2">Сделки за период:</p>
      <div className="flex gap-1">
        {dateRanges.map((item) => (
          <Button
            key={item.name}
            variant="outline"
            onClick={() => handleClick(item.name as DateRange)}
            className={`${dateRangeState === item.name && "border-2 border-foreground border-solid"}`}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div className="p-2 border flex justify-around rounded-md font-semibold">
        <span>Проекты: {projectsCount?.length}</span> /{" "}
        <span>Отказы: {retailsCount?.reject}</span> /{" "}
        <span>Закрыты: {retailsCount?.closed}</span>
      </div>
      <div className="p-2 border flex justify-around rounded-md font-semibold">
        <span>Розница: {retailsCount?.length}</span> /{" "}
        <span>Отказы: {retailsCount?.reject}</span> /{" "}
        <span>Закрыты: {retailsCount?.closed}</span>
      </div>
    </div>
  );
};

export default ProfileDealsData;
