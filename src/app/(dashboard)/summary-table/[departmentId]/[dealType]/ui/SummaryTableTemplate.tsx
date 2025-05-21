"use client";

import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import React, { JSX } from "react";

import dynamic from "next/dynamic";

import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable";
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";

const DataTable = dynamic(() => import("@/shared/ui/Table/DataTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
}) as <T extends { id: string }>(props: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  getRowLink: (row: T, type: DealType) => string;
  isExistActionDeal: boolean;
  type: DealType;
}) => JSX.Element;

type SummaryTableTemplateProps<T extends { id: string }> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  getRowLink: (row: T, type: DealType) => string;
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
      {isError && <ErrorMessageTable message={error?.message} />}
      <div className="flex gap-2 flex-wrap">
        <LinkToUserTable />
        <p className="border rounded-md p-2">
          Общее количество заявок: {data.length}
        </p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        getRowLink={getRowLink}
        isExistActionDeal={false}
        type={type}
      />
    </DealTableTemplate>
  );
};

export default SummaryTableTemplate;
