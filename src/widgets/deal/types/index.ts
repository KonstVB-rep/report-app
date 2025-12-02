import type { ColumnDef } from "@tanstack/react-table"

type ColumnIds<T> = NonNullable<ColumnDef<T, unknown>["id"]>
export type HiddenCols<T> = Record<ColumnIds<T>, boolean>

export interface MyColumnMeta {
  hidden?: boolean
}
