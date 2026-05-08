import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn, formatterCurrency } from "@/shared/lib/utils";
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { type CellContext, type ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EditableCell from "../components/EditabledCell";
import { calculateKitTotal } from "../lib/calculateKitTotal";
import type {
  EquipmentWithQuantity,
  SerializedEquipmentKitItem,
} from "../lib/types";
import type { OfferTableItem } from "../store";
import {
  selectedKitId,
  selectedKits,
  selectSetSelectedKitId,
  selectUpdateLocalKit,
  useEquipmentStore,
} from "../store/localtemsStore";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import KitTable from "../components/KitTable";

export const defaultColumns: ColumnDef<OfferTableItem>[] = [
  {
    ...RowNumber<OfferTableItem>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: OfferTableItem) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "name",
    header: "Наименование",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = info.getValue();
      return value;
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: OfferTableItem) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = info.getValue();
      return value;
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: OfferTableItem) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return formatterCurrency.format(parseFloat(info.getValue() as string));
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    accessorFn: (row: OfferTableItem) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return info.getValue();
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    accessorFn: (row: OfferTableItem) => row.count,
  },
  {
    id: "totalPrice",
    header: "Итого, руб.",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return formatterCurrency.format(parseFloat(info.getValue() as string));
    },
    enableHiding: true,
    meta: {
      title: "Итого, руб.",
    },
    accessorFn: (row: OfferTableItem) => row.totalPrice,
  },
  {
    id: "purchasePrice",
    header: "Цена закупки",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(
        parseFloat(info.getValue() as string),
      );
      return <div>{value}</div>;
    },
    enableHiding: true,
    meta: {
      title: "Цена закупки",
    },
    accessorFn: (row: OfferTableItem) => row.purchasePrice,
  },
  {
    id: "purchaseAmount",
    header: "Сумма закупки",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(
        parseFloat(info.getValue() as string),
      );
      return <div>{value}</div>;
    },
    enableHiding: true,
    meta: {
      title: "Сумма закупки",
    },
    accessorFn: (row: OfferTableItem) => row.purchaseAmount,
  },
  {
    id: "delta",
    header: "Дельта",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(
        parseFloat(info.getValue() as string),
      );
      return <div>{value}</div>;
    },
    enableHiding: true,
    meta: {
      title: "Дельта",
    },
    accessorFn: (row: OfferTableItem) => row.delta,
  },
];

export const defaultColumnsEquipment: ColumnDef<EquipmentWithQuantity>[] = [
  {
    ...RowNumber<EquipmentWithQuantity>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: EquipmentWithQuantity) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label
        className={cn("flex items-center justify-center cursor-pointer gap-1")}
      >
        {table.getIsSomePageRowsSelected() ||
        table.getIsAllPageRowsSelected() ? (
          <Check />
        ) : (
          "Выбрать"
        )}
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="opacity-0 w-0 h-0"
          onCheckedChange={(value: CheckedState) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      </Label>
    ),
    cell: ({ row }) => {
      const selectKitId = useEquipmentStore(selectedKitId);

      if (selectKitId === row.original.id) {
        return (
          <div className="flex items-center justify-center gap-1">
            <div className="h-4 w-4 border-1 border-red-500 bg-amber-50 rounded-[4px] grid place-items-center relative">
              <X size={16} className="absolute text-red-500" />
            </div>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center gap-1">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value: CheckedState) =>
              row.toggleSelected(!!value)
            }
          />
        </div>
      );
    },
    accessorFn: (row) => row.id,
    enableSorting: false,
    enableHiding: false,
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "name",
    header: "Наименование",
    cell: (props) => <EditableCell {...props} tag="textarea" />,
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: EquipmentWithQuantity) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: (props) => <EditableCell {...props} tag="textarea" />,
    meta: {
      title: "Описание",
    },
    accessorFn: (row: EquipmentWithQuantity) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: (props) => <EditableCell {...props} tag="input" />,
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: EquipmentWithQuantity) => row.price,
  },
  {
    id: "actions",
    header: "",
    size: 80,
    maxSize: 80,
    accessorFn: (row) => row.id,
    cell: ({ setIsEdit, row, table }) => {
      const item = row.original;
      const handleClick = () => {
        setIsEdit((prev: boolean) => !prev);
      };

      const selectKitId = useEquipmentStore(selectedKitId);

      const contentsKit = item.contents ?? [];

      const handleSelectKit = () => {
        if (selectKitId) {
          selectSetSelectedKitId(null);
          return;
        }
        selectSetSelectedKitId(item.id);
        table.resetRowSelection();
        toast.info("Выберите позиции из списка для добавления в комплект", {
          duration: 3000,
        });
      };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Открыть меню</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Удалить</DropdownMenuItem>
              <DropdownMenuItem onClick={handleClick}>
                Изменить
              </DropdownMenuItem>
              {item.isKit && (
                <DropdownMenuItem onClick={handleSelectKit}>
                  <div className="grid gap-1">
                    <span>
                      {selectKitId
                        ? "Отменить добавление"
                        : "Добавить в комплект"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {contentsKit.length === 0 &&
                        `Количетсво позиций: (${item.contents?.length})`}
                    </span>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <KitTable data={contentsKit} />
                  </DrawerContent>
                </Drawer>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export const defaultColumnsKitEquipment: ColumnDef<EquipmentWithQuantity>[] = [
  {
    ...RowNumber<EquipmentWithQuantity>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: EquipmentWithQuantity) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label
        className={cn("flex items-center justify-center cursor-pointer gap-1")}
      >
        {table.getIsSomePageRowsSelected() ||
        table.getIsAllPageRowsSelected() ? (
          <Check />
        ) : (
          "Выбрать"
        )}
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="opacity-0 w-0 h-0"
          onCheckedChange={(value: CheckedState) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      </Label>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value: CheckedState) =>
              row.toggleSelected(!!value)
            }
          />
        </div>
      );
    },
    accessorFn: (row) => row.id,
    enableSorting: false,
    enableHiding: false,
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "name",
    header: "Наименование",
    cell: ({ row }) => {
      const value = row.original.name;
      return value;
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: EquipmentWithQuantity) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row }) => {
      const value = row.original.description;
      return value;
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: EquipmentWithQuantity) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: ({ row }) => {
      const item = row.original;
      const value = item.price as string;

      const displayPrice = item.isKit
        ? calculateKitTotal(item)
        : Number(item.price);
      return (
        <span>
          {formatterCurrency.format(parseFloat(String(displayPrice))) as string}
        </span>
      );
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: EquipmentWithQuantity) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: ({ row }) => {
      const initialValue = row.original.count;

      const [value, setValue] = useState<Number>(initialValue);
      const selectedKitsItems = useEquipmentStore(selectedKits);

      console.log(selectedKitsItems, "selectedKitsItems");

      return (
        <Input
          type="number"
          value={Number(value) as number}
          onChange={(e) => {
            if (Number.isNaN(Number(e.target.value))) {
              toast.error("Количество должно быть числом", {
                duration: 3000,
              });
              return;
            }
            if (e.target.value === "") {
              setValue(0);
            }
            setValue(Number(e.target.value));
            selectUpdateLocalKit(row.original.id, "count", e.target.value);
          }}
        />
      );
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: EquipmentWithQuantity) => row.count,
  },
];

export const defaultColumnsKitItems: ColumnDef<SerializedEquipmentKitItem>[] = [
  {
    ...RowNumber<SerializedEquipmentKitItem>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: SerializedEquipmentKitItem) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label
        className={cn("flex items-center justify-center cursor-pointer gap-1")}
      >
        {table.getIsSomePageRowsSelected() ||
        table.getIsAllPageRowsSelected() ? (
          <Check />
        ) : (
          "Выбрать"
        )}
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="opacity-0 w-0 h-0"
          onCheckedChange={(value: CheckedState) =>
            table.toggleAllPageRowsSelected(!!value)
          }
        />
      </Label>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value: CheckedState) =>
              row.toggleSelected(!!value)
            }
          />
        </div>
      );
    },
    accessorFn: (row) => row.id,
    enableSorting: false,
    enableHiding: false,
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "name",
    header: "Наименование",
    cell: ({ row }) => {
      const value = row.original.item.name;
      return value;
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: SerializedEquipmentKitItem) => row.item.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row }) => {
      const value = row.original.description;
      return value;
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: SerializedEquipmentKitItem) => row.item.description,
  },
  {
    id: "price",
    header: "Цена",

    cell: ({ row }) => {
      const kitItem = row.original;
      const value = kitItem.item.price as string;

      const displayPrice = kitItem.item.isKit
        ? calculateKitTotal(kitItem.item)
        : Number(kitItem.price);
      return (
        <span>
          {formatterCurrency.format(parseFloat(String(displayPrice))) as string}
        </span>
      );
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: SerializedEquipmentKitItem) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: ({ row }) => {
      const initialValue = row.original.count;

      const [value, setValue] = useState<Number>(initialValue);
      const selectedKitsItems = useEquipmentStore(selectedKits);

      console.log(selectedKitsItems, "selectedKitsItems");

      return (
        <Input
          type="number"
          value={Number(value) as number}
          onChange={(e) => {
            if (Number.isNaN(Number(e.target.value))) {
              toast.error("Количество должно быть числом", {
                duration: 3000,
              });
              return;
            }
            if (e.target.value === "") {
              setValue(0);
            }
            setValue(Number(e.target.value));
            selectUpdateLocalKit(row.original.id, "count", e.target.value);
          }}
        />
      );
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: SerializedEquipmentKitItem) => row.count,
  },
];
