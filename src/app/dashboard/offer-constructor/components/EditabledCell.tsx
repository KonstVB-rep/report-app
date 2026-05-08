import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn, formatterCurrency } from "@/shared/lib/utils";
import { Column, Row } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Equipment } from "../lib/types";
import { selectLocalItems, useEquipmentStore } from "../store/localtemsStore";
// 1. Создаем отдельный компонент для ячейки

type EditableCellProps<T extends Equipment> = {
  // Добавь = перед скобкой
  row: Row<T>;
  column: Column<T, unknown>;
  getValue: () => unknown;
  isEdit: boolean;
  localEditData: (id: string, field: string, value: string) => void;
  tag: string;
};

const EditableCell = <T extends Equipment>({
  row,
  column,
  getValue,
  isEdit,
  localEditData,
  tag,
}: EditableCellProps<T>) => {
  const initialValue = getValue() as string;

  const localItems = useEquipmentStore(selectLocalItems);

  const updatedValue = (localItems?.[row.original.id] as Record<string, any>)?.[
    column.id
  ] as string;

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(updatedValue ?? initialValue);
  }, [initialValue, updatedValue]);

  const isEditValue = updatedValue ? initialValue !== updatedValue : false;

  const handleReset = () => {
    setValue(initialValue);
    localEditData(row.original.id, column.id, initialValue);
  };

  return isEdit ? (
    <>
      {tag === "input" && (
        <Input
          className={cn(
            "w-full text-end text-black dark:text-white bg-white dark:bg-black",
            isEditValue && "border-blue-500",
          )}
          onBlur={() => localEditData(row.original.id, column.id, value)}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          value={value}
        />
      )}
      {tag === "textarea" && (
        <Textarea
          className={cn(
            "w-full text-start text-black dark:text-white bg-white dark:bg-black p-2",
            isEditValue && "border-blue-500",
          )}
          onBlur={() => localEditData(row.original.id, column.id, value)}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      )}
    </>
  ) : (
    <div className="grid">
      {tag === "input" && (
        <span>{formatterCurrency.format(parseFloat(value)) as string}</span>
      )}
      {tag === "textarea" && <span>{value}</span>}
      {isEditValue && (
        <div className="flex items-end flex-col">
          <span className="text-xs text-green-500 text-right block w-min text-wrap">
            Изменения не сохранены
          </span>
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-xs text-red-600 text-right w-min aspect-square grid place-content-center"
            title="Сбрость изменения"
            size="icon"
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableCell;
