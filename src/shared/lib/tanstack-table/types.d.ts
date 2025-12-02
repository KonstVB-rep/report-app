// src/shared/lib/react-table/types.d.ts
import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<_TData extends RowData, _TValue = unknown> {
    hidden?: boolean
  }
}
