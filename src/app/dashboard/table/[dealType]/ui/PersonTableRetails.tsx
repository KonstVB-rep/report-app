"use client";
import { useGetRetailsUser } from "@/entities/deal/hooks";
import { RetailResponse } from "@/entities/deal/types";
import { DealType } from "@prisma/client";
import { useParams } from "next/navigation";
import { columnsDataRetail } from "../[userId]/model/columns-data-retail";
import PersonTable from "./PersonTable";

const PersonTableRetail = () => {
  const { userId } = useParams();
  const { data: deals } = useGetRetailsUser(userId as string);

  const getRowLink = (row: RetailResponse) =>
    `/dashboard/deal/retail/${row.id}`;

  return (
    <PersonTable
      data={deals ?? []}
      type={DealType.RETAIL}
      columns={columnsDataRetail}
      getRowLink={getRowLink}
    />
  );
};

export default PersonTableRetail;
