"use client";

import React, { RefObject } from "react";
import DataTable from "@/shared/ui/Table/DataTable";
import { getRetailsUser } from "@/entities/deal/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useScrollIntoViewBlock from "@/shared/hooks/useScrollIntoViewBlock";
// import Loading from "./[userId]/loading";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/entities/user/ui/Toast";
import { DealTypeEnums, RetailResponse } from "@/entities/deal/types";
import SummaryTableLink from "@/entities/department/ui/SummaryTableLink";
import AddNewRetail from "@/entities/deal/ui/Modals/AddNewRetail";
import { columnsDataRetail } from "../[userId]/model/columns-data-retail";

// import UploadExcel from "@/shared/ui/UploadExcel";

const PersonTableRetail = () => {
  const { userId } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthuser = userId === authUser?.id;

  const { data, isError } = useQuery({
    queryKey: ["retails", userId],
    queryFn: async () => {
      try {
        return await getRetailsUser(userId as string);
      } catch (error) {
        if (!isError) TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const ref = useScrollIntoViewBlock(
    data
  ) as unknown as RefObject<HTMLDivElement>;

  const getRowLink = (row: RetailResponse & { id: string }, type: string) => {
    return `/dashboard/deal/${type}/${row.id}`;
  };

  // if (isPending) return <Loading />;

  return (
    <DealTableTemplate ref={ref}>
      <>
        {isPageAuthuser && (
          <div className="flex items-center justify-between">
            <AddNewRetail />
            {/* <UploadExcel/> */}
            <SummaryTableLink />
          </div>
        )}
        <DataTable
          columns={columnsDataRetail}
          data={data ?? []}
          getRowLink={getRowLink}
          type={DealTypeEnums.RETAIL}
        />
      </>
    </DealTableTemplate>
  );
};

export default PersonTableRetail;
