import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable";
import dynamic from "next/dynamic";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";

const DataTable = dynamic(() => import("@/shared/ui/Table/DataTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton/>,
});

type SummaryTableTemplateProps<T extends { id: string }> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  getRowLink: (row: T, type: string) => string;
  type: DealType;
  isError: boolean;
  error: Error | null;
};

const SummaryTableTemplate = <T extends { id: string }>({
  columns,
  data,
  getRowLink,
  type,
  isError,
  error,
}: SummaryTableTemplateProps<T>) => {
  return (
    <DealTableTemplate>
      {isError && (
        <div className="grid h-full place-items-center p-4">
          <h1 className="rounded-md bg-muted p-4 text-center text-xl">
            {error?.message}
          </h1>
        </div>
      )}
      <LinkToUserTable />
      <DataTable
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        data={data as Record<string, unknown>[]}
        getRowLink={getRowLink as (row: Record<string, unknown>, type: string) => string}
        type={type}
      />
    </DealTableTemplate>
  );
};

export default SummaryTableTemplate;
