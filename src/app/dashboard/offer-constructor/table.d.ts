import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface CellContext<TData extends RowData, TValue> {
    updateData: (value: string | number) => void
  }
  // interface TableMeta<TData extends RowData> {
  //   totalPrice: (rowIndex: number) => number;
  // }
}
