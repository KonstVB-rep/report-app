import type { RefObject } from "react"
import type { Row } from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"

const ROW_HEIGHT = 57

interface UseVirtualizedRowTableProps<T> {
  rows: Row<T>[]
  tableContainerRef: RefObject<HTMLDivElement | null>
}

export const useVirtualizedRowTable = <T,>({
  rows,
  tableContainerRef,
}: UseVirtualizedRowTableProps<T>) => {
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  if (rows.length > 0) {
    return {
      virtualItems,
      totalSize,
      rowVirtualizer,
    }
  }

  return {
    virtualItems: [],
    totalSize: 0,
    rowVirtualizer,
  }
}

export default useVirtualizedRowTable
