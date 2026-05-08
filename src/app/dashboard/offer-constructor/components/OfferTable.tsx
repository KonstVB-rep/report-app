"use client";

import { type ChangeEvent, memo, useEffect, useState } from "react";
import type { Cell, Table } from "@tanstack/react-table";
import { ImagePlus, Trash2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatterCurrency } from "@/shared/lib/utils";
import {
  type OfferTableItem,
  selectSectionById,
  updateRow,
  useOfferStoreTable,
} from "../store";

const OfferTable = ({
  dataTable,
  table,
  partId,
  sectionId,
  removeRow,
  sectionName,
}: {
  dataTable: OfferTableItem[];
  table: Table<OfferTableItem>;
  partId: string;
  sectionId: string;
  removeRow: (rowId: string) => void;
  sectionName: string;
}) => {
  return (
    <div className="relative">
      <TableBodyOffer
        dataTable={dataTable}
        removeRow={removeRow}
        table={table}
      />
      <TableFooterOffer
        partId={partId}
        sectionId={sectionId}
        sectionName={sectionName}
        table={table}
      />
      {/* <div className="absolute top-0 left-0 a4 border-dashed border-2 border-white" /> */}
      {/* 
        ))} */}
    </div>
  );
};

export default OfferTable;

const TableBodyOffer = ({
  table,
  dataTable,
  removeRow,
}: {
  table: Table<OfferTableItem>;
  dataTable: OfferTableItem[];
  removeRow: (rowId: string) => void;
}) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <This is style from documentation library>
  const rows = table.getRowModel().rows.filter((row) => {
    return dataTable.some((d) => d.id === row.original.id);
  });

  return (
    <div className="tbody">
      {rows.map((row) => {
        return (
          <div className="flex relative" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <CellOfferTable cell={cell} key={cell.id} />
            ))}
            <Button
              className="absolute top-0 -right-10"
              onClick={() => removeRow(row.original.rowId)}
              size="icon"
              title="Удалить строку"
              variant="outline"
            >
              <Trash2 />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

// export const MemoizedTableBody = memo(TableBodyOffer, (prev, next) => {
//   const sameData = prev.dataTable === next.dataTable;

//   const sameVisibility = prev.columnVisibility === next.columnVisibility;

//   return sameData && sameVisibility;
// }) as typeof TableBodyOffer;

const TableFooterOffer = ({
  table,
  sectionName,
  sectionId,
  partId,
}: {
  table: Table<OfferTableItem>;
  sectionName: string;
  sectionId: string;
  partId: string;
}) => {
  // const { totalPriceOffer, totalPricePurchase, totalDelta } =
  //   useOfferStoreTable();
  const section = useOfferStoreTable(selectSectionById(partId, sectionId));

  return (
    <div className="tfooter flex">
      {table.getAllColumns().map((column) => {
        if (column.columnDef.meta?.hidden || !column.getIsVisible())
          return null;
        return (
          <div
            className="p-2 td min-w-12 min-h-[57px] relative flex items-center"
            key={column.id}
            style={{
              width: `calc(var(--col-${column.id}-size) * 1px)`,
            }}
          >
            <span className="text-end block w-full relative">
              {column.id === "totalPrice" && (
                <>
                  <span className="text-nowrap absolute right-[110%]">
                    ИТОГО {sectionName}:
                  </span>
                  {formatterCurrency.format(Number(section?.totalPrice))}
                </>
              )}
              {column.id === "purchaseAmount" &&
                formatterCurrency.format(Number(section?.totalPurchase))}
              {column.id === "delta" &&
                formatterCurrency.format(Number(section?.totalDelta))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const CellOfferTable = memo(
  ({ cell }: { cell: Cell<OfferTableItem, unknown> }) => {
    const initialValue = (cell.getValue() as string) ?? "";
    const [value, setValue] = useState<string>(initialValue);
    const [isEditing, setIsEditing] = useState(false); // Состояние для переключения режима

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    const handlePersist = () => {
      setIsEditing(false); // Выходим из режима редактирования
      if (value !== initialValue) {
        // Убираем случайные пробелы, если пользователь их ввел вручную
        const cleanValue = value.replace(/\s/g, "").replace(",", ".");
        const updateItem = {
          ...cell.row.original,
          [cell.column.id]: cleanValue,
        };
        updateRow(updateItem);
      }
    };

    // Определяем, является ли колонка денежной
    const isPriceCol = [
      "price",
      "purchasePrice",
      "totalPrice",
      "purchaseAmount",
      "delta",
    ].includes(cell.column.id);
    // Колонки, которые нельзя редактировать вручную (только вывод)
    const isReadOnlyPrice = ["totalPrice", "purchaseAmount", "delta"].includes(
      cell.column.id,
    );

    return (
      <div
        className="p-2 min-w-12 border-b border-r min-h-[57px] flex items-start"
        key={cell.id}
        style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
      >
        <div className="grid gap-2 justify-items-center w-full">
          {isPriceCol ? (
            isReadOnlyPrice || !isEditing ? (
              <Button
                className="text-end w-full py-2 px-1 min-h-[37px] flex items-center justify-end cursor-text"
                onClick={() => !isReadOnlyPrice && setIsEditing(true)}
              >
                {formatterCurrency.format(parseFloat(value || "0"))}
              </Button>
            ) : (
              <input
                className="text-end w-full shadow-none border-none px-1 py-2 bg-transparent outline-none ring-1 ring-blue-500 rounded-sm"
                onBlur={handlePersist}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                value={value}
              />
            )
          ) : cell.column.id === "name" || cell.column.id === "description" ? (
            <Textarea
              className="text-xs"
              onBlur={handlePersist}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          ) : (
            <input
              className="text-end w-full shadow-none border-none px-1 py-2 bg-transparent outline-none"
              onBlur={handlePersist}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          )}

          {cell.column.id === "name" && <Cell row={cell.row.original} />}
        </div>
      </div>
    );
  },
);

const Cell = ({ row }: { row: OfferTableItem }) => {
  const [imagePreview, setImagePreview] = useState<string | null>("");
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type === "image/webp") {
        alert("Формат WebP не поддерживается в PDF. Используйте PNG или JPG.");
        return;
      }
      const reader = new FileReader();
      const image = URL.createObjectURL(file);

      reader.onloadend = () => {
        const base64String = reader.result as string;

        updateRow({ ...row, image: base64String });
      };
      reader.readAsDataURL(file);

      setImagePreview(image);
    }
  };
  return (
    <div className="mt-2 flex flex-col gap-2">
      {imagePreview && (
        <div className="flex gap-1 items-start">
          <img
            alt="Preview"
            className=" h-24 w-24 object-cover rounded-md border ratio-square border-gray-400 m-auto"
            src={row.image || imagePreview}
          />

          <Button
            onClick={() => setImagePreview("")}
            size="icon"
            variant="destructive"
          >
            <X />
          </Button>
        </div>
      )}

      <Label className="cursor-pointer flex items-center gap-2">
        <ImagePlus size={20} />
        <span>{imagePreview ? "Изменить фото" : "Добавить фото"}</span>

        <Input
          accept="image/*"
          className="hidden"
          name="name"
          onChange={handleFileChange}
          type="file"
        />
      </Label>
    </div>
  );
};
