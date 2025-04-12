import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable";
import dynamic from "next/dynamic";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable";

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
        <ErrorMessageTable message={error?.message} />
      )}
      <LinkToUserTable />
      <DataTable
        columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
        data={data as Record<string, unknown>[]}
        getRowLink={getRowLink as (row: Record<string, unknown>, type: string) => string}
        isExistActionDeal={false}
        type={type}
      />
    </DealTableTemplate>
  );
};

export default SummaryTableTemplate;
