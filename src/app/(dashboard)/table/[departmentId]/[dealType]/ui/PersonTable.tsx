"use client";
import React, { RefObject } from "react";

import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import useStoreUser from "@/entities/user/store/useStoreUser";
import useScrollIntoViewBlock from "@/shared/hooks/useScrollIntoViewBlock";
import DataTable from "@/shared/ui/Table/DataTable";
import { useParams } from "next/navigation";

interface PersonTableProps<T> {
  data: T[];
  type: DealType;
  columns: ColumnDef<T>[]; // Можешь уточнить тип колонок, если он известен
  getRowLink: (row: T, type: string) => string;
  isPending: boolean;
}

const PersonTable = <T extends { id: string }>({
  data,
  type,
  columns,
  getRowLink,
  isPending,
}: PersonTableProps<T>) => {
  const { userId } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthuser = userId === authUser?.id;

  const ref = useScrollIntoViewBlock(
    data
  ) as unknown as RefObject<HTMLDivElement>;


  return (
    <DealTableTemplate ref={ref}>
      <>
        {isPageAuthuser && <ButtonsGroupTable />}
        <DataTable
          columns={columns}
          data={data ?? []}
          getRowLink={getRowLink}
          type={type}
          isPending={isPending}
        />
      </>
    </DealTableTemplate>
  );
};

export default PersonTable;
