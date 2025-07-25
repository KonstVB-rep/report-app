import { DealType } from "@prisma/client";
import { Table } from "@tanstack/react-table";

import React from "react";
import { DateRange } from "react-day-picker";

import { useParams, usePathname } from "next/navigation";

import { LABELS } from "@/entities/deal/lib/constants";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { useDataTableFiltersContext } from "@/feature/tableFilters/context/useDataTableFiltersContext";

import DateRangeFilter from "../../DateRangeFilter";
import MotionDivY from "../../MotionComponents/MotionDivY";
import SelectColumns from "../../SelectColumns";
import FilterByUser from "../FilterByUsers";
import FilterPopoverGroup from "../FilterPopoverGroup";

type FiltersBlockProps = {
  value?: DateRange;
  table: Table<Record<string, unknown>>;
  type: DealType;
};

const FiltersBlock = ({ value, table, type }: FiltersBlockProps) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  const { dealType } = useParams();

  const { setColumnFilters, handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  const hasTable = pathname.includes(
    `/summary-table/${authUser?.departmentId}/${dealType}/${authUser?.id}`
  );

  const safeType = type as Exclude<DealType, "ORDER">;

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
            columnFilters={table.getState().columnFilters}
            setColumnFilters={setColumnFilters}
          />

          <SelectColumns data={table as Table<Record<string, unknown>>} />
        </div>
      </div>
    </MotionDivY>
  );
};

export default FiltersBlock;
