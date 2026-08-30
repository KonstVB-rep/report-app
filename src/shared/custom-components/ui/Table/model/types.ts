import type { Header, Row } from "@tanstack/react-table"

export type SharedTableRowProps<T> = {
  row: Row<T>
  virtualRow: { index: number; start: number }
  headers?: Header<T, unknown>[]
  hasEditDeleteActions?: boolean
}
