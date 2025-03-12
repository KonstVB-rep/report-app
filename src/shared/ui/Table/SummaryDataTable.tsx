"use client";

import React, { useState } from "react";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";

import FilterPopover from "../FilterPopover";
import { useQuery } from "@tanstack/react-query";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { getAllUsersByDepartmentNameAndId } from "@/entities/user/api";
import { TOAST } from "@/entities/user/ui/Toast";

import DataTable from "./DataTable";
import { ProjectResponse } from "@/entities/project/types"; // Импортируем ProjectResponse

// Убрали дженерик TData
interface SummaryDataTableProps {
  data: ProjectResponse[]; // Теперь работаем только с ProjectResponse[]
  columns: ColumnDef<ProjectResponse, unknown>[]; // Теперь работаем только с ProjectResponse
}

const SummaryDataTable = ({
  // Убрали дженерик TData
  columns,
  data,
}: SummaryDataTableProps) => {
  const { authUser } = useStoreUser();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: usersDepartment, isPending: isPendingUsersDepartment } =
    useQuery({
      queryKey: ["users", authUser?.departmentId],
      queryFn: async () => {
        try {
          const users = await getAllUsersByDepartmentNameAndId(
            authUser!.departmentId
          );

          return users;
        } catch (error) {
          console.log(error);
          TOAST.ERROR("Произошла ошибка при получении пользователей");
        }
      },
      enabled: !!authUser?.departmentId,
    });
  // Добавили getRowLink
  const getRowLink = (row: ProjectResponse & { id: string }) => {
    return `/dashboard/projects/${row.id}`;
  };

  return (
    <>
      <div className="max-w-fit">
        {isPendingUsersDepartment && (
          <div className="w-32 h-9 bg-muted animate-pulse rounded-md" />
        )}
        {usersDepartment && (
          <FilterPopover
            columnId="user"
            options={usersDepartment}
            label="Менеджер"
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        )}
      </div>
      
      <DataTable columns={columns} data={data} getRowLink={getRowLink} />
    </>
  );
};

export default SummaryDataTable;
