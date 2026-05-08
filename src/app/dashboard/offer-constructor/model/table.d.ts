import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface CellContext<TData extends RowData, TValue> {
    updateData: (value: string | number) => void;
    isEdit: boolean;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    localEditData: (id: string, field: string, value: string) => void;
  }
}
