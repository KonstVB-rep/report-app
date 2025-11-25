import { PermissionEnum } from "@prisma/client"
import type { ColumnDef, Table } from "@tanstack/react-table"
import { useParams } from "next/navigation"
import { FormatedParamsType, type FormatedParamsTypeKey } from "@/feature/deals/lib/constants"
import { Button } from "@/shared/components/ui/button"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import ICONS_TYPE_FILE from "@/widgets/Files/libs/iconsTypeFile"

const handleExport = async <TData,>(
  table: Table<TData>,
  columns: ColumnDef<TData>[],
  tableType?: string,
) => {
  const { downloadToExcel } = await import("./downLoadToExcel")
  downloadToExcel(table, columns, { tableType })
}

type ButtonExportXlsType<T extends Record<string, unknown>> = {
  columns: ColumnDef<T>[]
  table: Table<T>
  isShow: boolean
}

// const pageParamsSchema = z.object({
//   dealType: z.enum(TableTypes).optional(),
// });

const ButtonExportTableXls = <T extends Record<string, unknown>>({
  columns,
  table,
  isShow,
}: ButtonExportXlsType<T>) => {
  const { dealType } = useParams()

  if (!isShow) {
    return null
  }
  return (
    <ProtectedByPermissions permission={PermissionEnum.DOWNLOAD_REPORTS}>
      <Button
        className="w-fit border p-2 hover:bg-slate-700"
        onClick={() =>
          handleExport<T>(table, columns, FormatedParamsType[dealType as FormatedParamsTypeKey])
        }
        title="Export to XLSX"
        variant={"ghost"}
      >
        {ICONS_TYPE_FILE[".xls"]({ width: 20, height: 20 })}
      </Button>
    </ProtectedByPermissions>
  )
}

export default ButtonExportTableXls
