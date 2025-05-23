import { DealType } from "@prisma/client";
import { ColumnDef, ColumnFiltersState, Table } from "@tanstack/react-table";

import React, { Dispatch, SetStateAction } from "react";
import { DateRange } from "react-day-picker";

import { useParams, usePathname } from "next/navigation";

import { LABELS } from "@/entities/deal/lib/constants";
import useStoreUser from "@/entities/user/store/useStoreUser";

import DateRangeFilter from "../../DateRangeFilter";
import MotionDivY from "../../MotionComponents/MotionDivY";
import MultiColumnFilter from "../../MultiColumnFilter";
import SelectColumns from "../../SelectColumns";
import FilterByUser from "../FilterByUsers";
import FilterPopoverGroup from "../FilterPopoverGroup";

type FiltersBlockProps = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
  columns: ColumnDef<Record<string, unknown>, unknown>[];
  includedColumns: string[];
  selectedColumns: string[];
  setSelectedColumns: Dispatch<SetStateAction<string[]>>;
  filterValueSearchByCol: string;
  setFilterValueSearchByCol: Dispatch<SetStateAction<string>>;
  value?: DateRange;
  onDateChange: (date: DateRange | undefined) => void;
  onClearDateFilter: (columnId: string) => void;
  table: Table<Record<string, unknown>>;
  type: DealType;
};

const FiltersBlock = ({
  setColumnFilters,
  includedColumns,
  selectedColumns,
  setSelectedColumns,
  filterValueSearchByCol,
  setFilterValueSearchByCol,
  value,
  onDateChange,
  onClearDateFilter,
  table,
  type,
}: FiltersBlockProps) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  const { dealType } = useParams();

  const hasTable = pathname.includes(
    `/summary-table/${authUser?.departmentId}/${dealType}/${authUser?.id}`
  );

  return (
    <MotionDivY className="min-h-0">
      {/* {hasTable && <FilterByUser
        columnFilters={table.getState().columnFilters}
        setColumnFilters={setColumnFilters}
        label="Менеджер"
      />} */}

      <div className="py-2 flex flex-wrap justify-start gap-2">
        {hasTable && (
          <FilterByUser
            columnFilters={table.getState().columnFilters}
            setColumnFilters={setColumnFilters}
            label="Менеджер"
          />
        )}

        <div className="flex gap-2 justify-start flex-wrap">
          <DateRangeFilter
            onDateChange={onDateChange}
            onClearDateFilter={onClearDateFilter}
            value={value}
          />

          <MultiColumnFilter
            columns={
              table.getAllColumns() as ColumnDef<
                Record<string, unknown>,
                unknown
              >[]
            }
            setColumnFilters={setColumnFilters}
            includedColumns={includedColumns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            filterValueSearchByCol={filterValueSearchByCol}
            setFilterValueSearchByCol={setFilterValueSearchByCol}
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
                options: LABELS[type].STATUS,
              },
              {
                label: "Направление",
                columnId: "direction",
                options: LABELS[type].DIRECTION,
              },
              {
                label: "Тип поставки",
                columnId: "deliveryType",
                options: LABELS[type].DELIVERY,
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
