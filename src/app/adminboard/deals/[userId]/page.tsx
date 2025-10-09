"use client";

import { useRef, useState } from "react";

import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable";
import { useGetAllDealsDepartment } from "@/feature/deals/api/hooks/query";
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider";
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage";
import { useTableState } from "@/shared/hooks/useTableState";
import { useVirtualizedRowTable } from "@/shared/hooks/useVirtualizedRowTable";
import { columnsDataDeals } from "@/widgets/deal/model/adminboard/columns-data-deals";

import DealsAllTable from "../ui/DealsAllTable";
import DealsDrawer from "../ui/DealsDrawer";
import DealsFilters from "../ui/DealsFilters";
import DealsToolbar from "../ui/DealsToolbar";
import Loading from "./loading";

const AllDealsPage = () => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null);

  const { data, error, isError, isPending } = useGetAllDealsDepartment();
  const { table, filtersContextValue, openFilters, setGlobalFilter } =
    useTableState(data?.deals || [], columnsDataDeals, {
      resource: false,
      dealStatusP: false,
      dealStatusR: false,
    });

  const { rows } = table.getRowModel();

  const { virtualItems, totalSize } = useVirtualizedRowTable({
    rows,
    tableContainerRef,
  });

  if (isPending) return <Loading />;

  return (
    <section className="px-4 py-2 grid gap-2 content-start relative flex-1">
      {isError && <ErrorMessageTable message={error?.message} />}

      <TitlePageBlock
        title="Список всех заявок"
        subTitle={`Количество сделок: ${data?.totalDealsCount}`}
        infoText="Здесь вы можете удалять или переназначать клиентов между менеджерами."
      />

      <DataTableFiltersProvider value={filtersContextValue}>
        <DealsToolbar
          totalCount={data?.totalDealsCount ?? 0}
          table={table}
          columns={columnsDataDeals}
          globalFilter={table.getState().globalFilter ?? ""}
          setGlobalFilter={setGlobalFilter}
          openFilters={openFilters}
        />

        <DealsFilters table={table} open={openFilters} />
        <DealsAllTable
          table={table}
          rows={rows}
          virtualItems={virtualItems}
          totalSize={totalSize}
          openFullInfoCell={openFullInfoCell}
          setOpenFullInfoCell={setOpenFullInfoCell}
          tableContainerRef={tableContainerRef}
          openFilters={openFilters}
        />
      </DataTableFiltersProvider>
      {<DealsDrawer table={table} />}
    </section>
  );
};

export default AllDealsPage;
