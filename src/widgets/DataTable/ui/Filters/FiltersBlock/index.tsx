import { DealType } from "@prisma/client";
import { Table } from "@tanstack/react-table";

import React from "react";
import { DateRange } from "react-day-picker";

import { useParams, usePathname } from "next/navigation";

import useStoreUser from "@/entities/user/store/useStoreUser";
import {
  FormatedParamsType,
  FormatedParamsTypeKey,
  LABELS,
} from "@/feature/deals/lib/constants";
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext";
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import SelectColumns from "@/shared/custom-components/ui/SelectColumns";

import FilterByUser from "../FilterByUsers";
import FilterPopoverGroup from "../FilterPopoverGroup";

type FiltersBlockProps = {
  isShow: boolean;
  table: Table<Record<string, unknown>>;
};

const FiltersBlock = ({ table, isShow }: FiltersBlockProps) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  const { dealType } = useParams();

  const { handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  if (!isShow) return null;

  const { columnFilters } = table.getState();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

  const hasTable = pathname.includes(
    `/summary-table/${authUser?.departmentId}/${dealType}/${authUser?.id}`
  );

  const safeType = FormatedParamsType[
    dealType as FormatedParamsTypeKey
  ] as Exclude<DealType, "ORDER">;

  return (
    <MotionDivY className="min-h-0">
      <div className="py-2 flex flex-wrap justify-start gap-2">
        {hasTable && <FilterByUser label="Менеджер" />}

        <div className="flex gap-2 justify-start flex-wrap">
          <DateRangeFilter
            onDateChange={handleDateChange("dateRequest")}
            onClearDateFilter={handleClearDateFilter}
            value={value}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-background">
        <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
          <FilterPopoverGroup
            options={[
              {
                label: "Статус",
                columnId: "dealStatus",
                options: LABELS[safeType].STATUS,
              },
              {
                label: "Направление",
                columnId: "direction",
                options: LABELS[safeType].DIRECTION,
              },
              {
                label: "Тип поставки",
                columnId: "deliveryType",
                options: LABELS[safeType].DELIVERY,
              },
            ]}
          />

          <SelectColumns data={table as Table<Record<string, unknown>>} />
        </div>
      </div>
    </MotionDivY>
  );
};

export default FiltersBlock;
