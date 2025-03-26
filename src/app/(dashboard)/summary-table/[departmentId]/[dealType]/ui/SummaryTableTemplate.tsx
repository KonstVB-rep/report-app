import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable";
import DataTable from "@/shared/ui/Table/DataTable";

type SummaryTableTemplateProps<T extends { id: string }> = {
  columns: ColumnDef<T, unknown>[];
  data: T[]; 
  getRowLink: (row: T, type: string) => string;
  type: DealType;
  isError: boolean;
  error: Error | null;
  isPending: boolean;
};

const SummaryTableTemplate = <T extends { id: string }>({
  columns,
  data,
  getRowLink,
  type,
  isError,
  error,
  isPending,
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
      <DataTable columns={columns} data={data} getRowLink={getRowLink} type={type} isPending={isPending}/>
    </DealTableTemplate>
  );
};

export default SummaryTableTemplate;
