import { PermissionEnum } from "@prisma/client";
import { ColumnDef, Table } from "@tanstack/react-table";

import React from "react";

import { useParams } from "next/navigation";

import {
  FormatedParamsType,
  FormatedParamsTypeKey,
} from "@/feature/deals/lib/constants";
import { Button } from "@/shared/components/ui/button";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";
import { DealBase } from "@/shared/custom-components/ui/Table/model/types";
import ICONS_TYPE_FILE from "@/widgets/Files/libs/iconsTypeFile";

const handleExport = async <TData,>(
  table: Table<TData>,
  columns: ColumnDef<TData>[],
  tableType?: string
) => {
  const { downloadToExcel } = await import("./downLoadToExcel");
  downloadToExcel(table, columns, { tableType });
};

type ButtonExportXlsType<T extends DealBase> = {
  columns: ColumnDef<T>[];
  table: Table<T>;
  isShow: boolean;
};

const ButtonExportTableXls = <T extends DealBase>({
  columns,
  table,
  isShow,
}: ButtonExportXlsType<T>) => {
  const { dealType } = useParams();
  if (!isShow) {
    return null;
  }
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.DOWNLOAD_REPORTS]}>
      <Button
        variant={"ghost"}
        onClick={() =>
          handleExport<T>(
            table,
            columns,
            FormatedParamsType[dealType as FormatedParamsTypeKey]
          )
        }
        className="w-fit border p-2 hover:bg-slate-700"
        title="Export to XLSX"
      >
        {ICONS_TYPE_FILE[".xls"]({ width: 20, height: 20 })}
      </Button>
    </ProtectedByPermissions>
  );
};

export default ButtonExportTableXls;
