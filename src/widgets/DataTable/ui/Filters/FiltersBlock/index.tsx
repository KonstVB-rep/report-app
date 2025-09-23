import { Table } from "@tanstack/react-table";

import { DateRange } from "react-day-picker";

import { usePathname } from "next/navigation";

import z from "zod";

import { TableTypesWithContracts } from "@/entities/deal/lib/constants";
import { getManagers } from "@/entities/department/lib/utils";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { FormatedParamsType, LABELS } from "@/feature/deals/lib/constants";
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext";
import FilterByUser from "@/feature/filter-persistence/ui/FilterByUsers";
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup";
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import SelectColumns from "@/shared/custom-components/ui/SelectColumns";
import { useTypedParams } from "@/shared/hooks/useTypedParams";

type FiltersBlockProps = {
  table: Table<Record<string, unknown>>;
};

const pageParamsSchema = z.object({
  dealType: z.enum(TableTypesWithContracts),
});

const FiltersBlock = ({ table }: FiltersBlockProps) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  const { dealType } = useTypedParams(pageParamsSchema);

  const { handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  const { columnFilters } = table.getState();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

  const hasTable = pathname.includes(
    `/summary-table/${authUser?.departmentId}/${dealType}/${authUser?.id}`
  );

  const safeType = FormatedParamsType[dealType];

  return (
    <MotionDivY className="min-h-0">
      <div className="py-2 flex flex-wrap justify-start gap-2">
        {hasTable && <FilterByUser label="Менеджер" managers={getManagers()} />}

        <div className="flex gap-2 justify-start flex-wrap">
          <DateRangeFilter
            onDateChange={handleDateChange("dateRequest")}
            onClearDateFilter={handleClearDateFilter}
            value={value}
          />
        </div>
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
