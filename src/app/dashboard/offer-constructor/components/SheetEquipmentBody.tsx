import { Button } from "@/shared/components/ui/button";
import { SheetFooter } from "@/shared/components/ui/sheet";
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  type ColumnFiltersState,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  type Row,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useAddItemsToKit,
  useDeleteEquipments,
  useUpdateEquipments,
} from "../hooks/mutate";
import { useGetEquipments } from "../hooks/query";
import SkeletonSheetEquipment from "../lib/SkeletonSheetEquipment";
import type { EquipmentWithQuantity } from "../lib/types";
import { defaultColumnsEquipment } from "../model/defaultColumns";
import { addRows, selectActiveTarget, useOfferStoreTable } from "../store";
import {
  selectedKitId,
  selectLocalItems,
  selectSetLocalItem,
  selectSetLocalKit,
  useEquipmentStore,
} from "../store/localtemsStore";
import AddNewEquipmentDialog from "./AddNewEquipmentDialog";
import AddToKitDialog from "./AddToKitDialog";
import EquipmentTable from "./EquipmentTable";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const SheetEquipmentBody = () => {
  const { data: equipmets, isLoading } = useGetEquipments();

  const tableData = equipmets ?? [];
  const localItems = useEquipmentStore(selectLocalItems);

  const [columns] = useState<typeof defaultColumnsEquipment>(() => [
    ...defaultColumnsEquipment,
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  });

  const table = useReactTable<EquipmentWithQuantity>({
    data: tableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 60,
      maxSize: 1600,
    },
    autoResetPageIndex: false,
    meta: {
      localItems,
    },
  });

  const { rowSelection } = table.getState();
  const equipmentSelected = table
    .getRowModel()
    .rows.filter((row) => rowSelection[row.id]);

  if (isLoading) {
    return <SkeletonSheetEquipment />;
  }

  return (
    <>
      <div className="flex gap-2">
        <AddNewEquipmentDialog />
        <DebouncedInput
          className="p-2 font-lg shadow border border-block"
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Поиск..."
          value={table.getState().globalFilter ?? ""}
        />
      </div>
      <EquipmentTable setLocalItem={selectSetLocalItem} table={table} />
      <SheetEquipmentFooter
        localItems={localItems}
        resetSelections={table.resetRowSelection}
        rowSelection={equipmentSelected}
      />
    </>
  );
};

export default SheetEquipmentBody;

const SheetEquipmentFooter = ({
  rowSelection,
  resetSelections,
  localItems,
}: {
  rowSelection: Row<EquipmentWithQuantity>[];
  resetSelections: () => void;
  localItems: Record<string, Partial<EquipmentWithQuantity>>;
}) => {
  // const [selectedKitId, setSelectedKitId] = useState<string>("");

  // const { data: equipments } = useGetEquipments();
  // const allKits = equipments?.filter((item) => item.isKit) || [];

  // const { mutate: addToKit, isPending: isPendingKit } = useAddItemsToKit();

  const ids: string[] = [];

  const seleted = rowSelection.map((row) => {
    ids.push(row.original.id);
    return {
      ...row.original,
      rowId: crypto.randomUUID(),
      image: row.original.image ?? "",
      price: row.original.price ? row.original.price.toString() : "0,00",
      count: 1,
      totalPrice: "0",
      purchasePrice: "0",
      purchaseAmount: "0",
      delta: "0",
    };
  });

  const updatedItems = Object.entries(localItems).map(([id, fields]) => ({
    id,
    ...fields,
  }));

  const { mutate: deleteItems, isPending } = useDeleteEquipments();
  const { mutate: updateItems, isPending: isPendingUpdate } =
    useUpdateEquipments();

  const { mutate: addToKit, isPending: isPendingKit } = useAddItemsToKit();

  const isSelected = useOfferStoreTable(selectActiveTarget);

  const selectKitId = useEquipmentStore(selectedKitId);

  const allRows = useMemo(() => {
    return rowSelection.map((row) => ({ ...row.original, count: 1 }));
  }, [rowSelection]);

  const handleAddToKitLocal = () => {
    if (!selectKitId) {
      toast.error("Сначала выберите комплект!");
      return;
    }
    selectSetLocalKit(allRows);
  };

  return (
    <SheetFooter className="p-1 z-50 flex gap-2">
      <Button
        disabled={!isSelected?.sectionId}
        onClick={() => {
          addRows(seleted);
          resetSelections();
        }}
      >
        Добавить в таблицу
      </Button>
      <Button
        disabled={!Object.keys(localItems).length || isPendingUpdate}
        onClick={() => {
          updateItems(updatedItems);
          resetSelections();
        }}
      >
        {isPendingUpdate ? (
          <span className="flex gap-2">
            <LoaderCircle className="w-5 h-5" />
            "Обновление..."
          </span>
        ) : (
          "Обновить"
        )}
      </Button>
      <Button
        disabled={!ids.length}
        onClick={() => {
          deleteItems(ids);
          resetSelections();
        }}
      >
        {isPending ? (
          <span className="flex gap-2">
            <LoaderCircle className="w-5 h-5" />
            "Удаление..."
          </span>
        ) : (
          "Удалить"
        )}
      </Button>
      <DialogComponent
        classNameContent="w-full sm:max-w-[1200px]"
        dialogTitle="Добавить в комплект"
        trigger={
          <Button
            disabled={!ids.length || isPendingKit}
            onClick={handleAddToKitLocal}
          >
            Добавить в комплект
          </Button>
        }
      >
        <AddToKitDialog rowSelection={rowSelection} />
      </DialogComponent>
    </SheetFooter>
  );
};
