import type { Row } from "@tanstack/react-table"

const RowNumber = <T,>() => {
  return {
    id: "rowNumber",
    header: "№",
    cell: ({ row }: { row: Row<T> }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
    maxSize: 80,
    meta: {
      isNotSearchable: true,
      title: "№",
      hidden: true,
    },
  }
}

export default RowNumber
