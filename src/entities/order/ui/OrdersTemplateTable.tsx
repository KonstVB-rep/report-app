"use client";

// import { DealType } from "@prisma/client";
import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import React from "react";

// import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import { DealBase } from "@/shared/custom-components/ui/Table/model/types";

import DataOrderTable from "./DataOrderTable";

export const DealTypeLabels: Record<string, string> = {
  projects: "Проекты",
  retails: "Розничные сделки",
  // contracts: "Договора",
  orders: "Заявки",
};

interface OrdersTemplateTableProps<T extends DealBase> {
  data: T[];
  columns: ColumnDef<T>[];
}

const OrdersTemplateTable = <T extends DealBase>({
  data,
  columns,
}: OrdersTemplateTableProps<T>) => {
  const { dealType } = useParams();

  return (
    <DealTableTemplate>
      <>
        <div className="flex flex-wrap justify-between gap-3 w-full">
          <p className="border rounded-md p-2">
            {DealTypeLabels[dealType as string]}
          </p>
          <p className="border rounded-md p-2">
            Общее количество заявок: {data.length}
          </p>
        </div>

        <ButtonsGroupTable />
        <DataOrderTable columns={columns} data={data} type={DealType.ORDER} />
      </>
    </DealTableTemplate>
  );
};

export default OrdersTemplateTable;
