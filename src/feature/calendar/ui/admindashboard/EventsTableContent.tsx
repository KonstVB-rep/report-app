import { useCallback, useMemo, useState } from "react"
import type { Row, Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
// import { getUsers } from "@/entities/department/lib/utils"
import { TableCell } from "@/shared/components/ui/table"
import { SkeletonTable } from "@/shared/custom-components/ui/Skeletons/SkeletonTable"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow"
import type { EventInputType } from "../../types"
import EventTableRow from "./EventTableRow"

interface EventsTableTemplateProps {
  table: Table<EventInputType>
  rows: Row<EventInputType>[]
  virtualItems: VirtualItem[]
  isLoading: boolean
  totalSize: number
}

// const users = getUsers({ onlyManagers: false })

const EventsTableContent = ({
  table,
  rows,
  virtualItems,
  isLoading,
  totalSize,
}: EventsTableTemplateProps) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)
  const headers = useMemo(() => table.getHeaderGroups()[0].headers, [table])

  const handleOpenInfo = useCallback(
    (rowId: string) => {
      setOpenFullInfoCell(openFullInfoCell === rowId ? null : rowId)
    },
    [openFullInfoCell],
  )

  const handleCloseInfo = useCallback(() => {
    setOpenFullInfoCell(null)
  }, [])

  if (isLoading) {
    return <SkeletonTable className="p-1 w-full" innerTable={false} />
  }

  return (
    <TableTemplate
      className="h-full max-h-[76vh] overflow-auto rounded-md"
      table={table}
      totalSize={totalSize || 57}
    >
      {table.getRowModel().rows.length > 0 ? (
        <VirtualRow
          renderRow={({ row, virtualRow }) => (
            <EventTableRow
              headers={headers}
              key={row.id}
              onCloseInfo={handleCloseInfo}
              onOpenInfo={handleOpenInfo}
              openFullInfoCell={openFullInfoCell}
              row={row}
              virtualRow={virtualRow}
            />
          )}
          rows={rows}
          virtualItems={virtualItems}
        />
      ) : (
        <tr className="flex items-center justify-center h-[57px]">
          <TableCell
            className="text-center h-full flex items-center justify-center text-sm uppercase"
            colSpan={headers.length}
          >
            Список событий календаря пуст
          </TableCell>
        </tr>
      )}
    </TableTemplate>
  )
}

export default EventsTableContent
