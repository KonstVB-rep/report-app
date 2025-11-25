import type { Row } from "@tanstack/react-table"

const RowNumber = <T,>() => {
  return {
    id: "rowNumber",
    header: "№",
    cell: ({ row }: { row: Row<T> }) => Number(row.index) + 1,
    enableHiding: true,
    enableSorting: false,
    accessorFn: () => "",
    maxSize: 100,
    enableResizing: false,
    meta: {
      isNotSearchable: true,
    },
  }
}

export default RowNumber
