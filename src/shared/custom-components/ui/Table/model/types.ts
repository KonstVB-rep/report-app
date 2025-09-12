import { ColumnDef, ColumnFiltersState, Row } from "@tanstack/react-table";
import { VirtualItem, Virtualizer } from "@tanstack/react-virtual";

export type DataTableType<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
};

export type FilterPopoverProps = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
};

export type TableBodyRowProps<T> = {
  row: Row<T>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
};

// type CommonProperties<Types extends unknown[]> = {
//   [Key in keyof Types[0]]:  // Берем ключи из первого типа
//     Types extends [infer First, ...infer Rest]
//       ? First[Key] & (Rest extends unknown[] ? CommonProperties<Rest>[Key] : unknown)
//       : never
// } extends infer Result
//   ? { [K in keyof Result as Result[K] extends never ? never : K]: Result[K] }
//   : never;

//  export type AllCommonKeys = CommonProperties<[ProjectResponse, RetailResponse, ContractResponse]>;

export type TypeBaseDT = {
  id: string;
  dealStatus?: string;
  type?: string;
};
