"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import DataTable from "./DataTable";
import { ProjectResponse } from "@/entities/deal/types";

// Убрали дженерик TData
interface SummaryDataTableProps {
  data: ProjectResponse[]; // Теперь работаем только с ProjectResponse[]
  columns: ColumnDef<ProjectResponse, unknown>[]; // Теперь работаем только с ProjectResponse
}

const SummaryDataTable = ({ columns, data }: SummaryDataTableProps) => {
  // const { authUser } = useStoreUser();
  // // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // const { data: usersDepartment, isPending: isPendingUsersDepartment } =
  //   useQuery({
  //     queryKey: ["users", authUser?.departmentId],
  //     queryFn: async () => {
  //       try {
  //         const users = await getAllUsersByDepartmentNameAndId(
  //           authUser!.departmentId
  //         );

  //         return users;
  //       } catch (error) {
  //         console.log(error);
  //         TOAST.ERROR("Произошла ошибка при получении пользователей");
  //       }
  //     },
  //     enabled: !!authUser?.departmentId,
  //   });
  // // Добавили getRowLink
  const getRowLink = (row: ProjectResponse & { id: string }) => {
    return `/projects/${row.id}`;
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowLink={getRowLink}
        type={"RETAIL"}
      />
    </>
  );
};

export default SummaryDataTable;
