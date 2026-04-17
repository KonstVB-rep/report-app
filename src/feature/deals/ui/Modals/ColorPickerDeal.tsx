import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import type { UserHighlight } from "@prisma/client";
import debounce from "debounce";
import { useParams } from "next/navigation";
import { STATUS_DEAL_COLOR } from "@/entities/deal/lib/constants";
import { DEAL_TYPE, type DealUnion } from "@/entities/deal/types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders";
import ModalContent from "@/shared/custom-components/ui/ModalContent";
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext";
import { useDeleteHilight, useSetHilight } from "../../api/hooks/mutate";
import { useGetHilightList } from "../../api/hooks/query";

const ColorPickerDeal = () => {
  const { selectedDataItem } = useTableContext<DealUnion>();
  const [color, setColor] = useState(selectedDataItem?.highlights || "");
  const { mutate } = useSetHilight();
  const { data: colors, refetch } = useGetHilightList();

  const { mutate: deleteAllColors } = useDeleteHilight();

  const debouncedMutate = useMemo(
    () =>
      debounce((colorValue: string) => {
        if (!selectedDataItem || !selectedDataItem.userId) return;
        mutate({
          id: selectedDataItem.id,
          type: selectedDataItem.type,
          color: colorValue,
          userId: selectedDataItem.userId,
        });
      }, 200),
    [mutate, selectedDataItem],
  );

  if (
    !selectedDataItem ||
    !STATUS_DEAL_COLOR.includes(selectedDataItem.dealStatus)
  )
    return null;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    debouncedMutate(newColor);
  };

  const deleteColors = () => {
    setColor("");
    if (!selectedDataItem.userId) return;
    deleteAllColors({
      id: selectedDataItem.id,
      type: selectedDataItem.type,
      color: null,
      userId: selectedDataItem.userId,
      all: true,
    });
    refetch();
  };

  return (
    <ModalContent className="max-w-[300px]">
      <div className="grid gap-4 pt-4">
        <h2 className="text-center font-bold">Выберите цвет</h2>
        <Input
          className="cursor-pointer h-8"
          onChange={handleColorChange}
          type="color"
          value={color}
        />
        <ColorsListUsed color={color} setColor={setColor} />
        {colors && colors.length > 0 && (
          <Button onClick={deleteColors} variant="outline">
            Удалить все
          </Button>
        )}
      </div>
    </ModalContent>
  );
};

export default ColorPickerDeal;

type ColorsListUsedType = {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
};

const ColorsListUsed = ({ color, setColor }: ColorsListUsedType) => {
  const { data: colors, isLoading, refetch } = useGetHilightList();
  const { selectedDataItem } = useTableContext<DealUnion>();
  const { userId } = useParams<{ userId: string }>();

  const { mutate } = useSetHilight();
  const { mutate: deleteCurrentColor } = useDeleteHilight();

  const uniqueColorObjects = useMemo(() => {
    if (!colors) return [];
    const map = new Map<string, (typeof colors)[0]>();

    colors.forEach((item) => {
      if (!map.has(item.color)) {
        map.set(item.color, item);
      }
    });

    return Array.from(map.values());
  }, [colors]);

  const deleteColor = (item: UserHighlight) => {
    const id = item.projectId ?? item.retailId;
    const realType = item.projectId ? DEAL_TYPE.PROJECT : DEAL_TYPE.RETAIL;

    if (!id || !userId) return;
    setColor("");
    deleteCurrentColor({
      id,
      type: realType,
      color: item.color,
      userId: userId,
    });
    refetch();
  };

  if (color && colors?.length === 0) {
    return null;
  }
  const handleClick = (item: UserHighlight) => {
    if (!item.color || !selectedDataItem || !selectedDataItem.userId) return;

    mutate({
      id: selectedDataItem.id,
      type: selectedDataItem.type,
      color: item.color,
      userId: userId,
    });

    setColor(item.color);
  };

  return (
    <div className="pt-2 flex overflow-x-auto gap-2">
      {isLoading ? (
        <LoaderCircle className="h-20 bg-muted rounded-md w-full px-4" />
      ) : (
        uniqueColorObjects?.map((item) => (
          <div className="grid items-center justify-start gap-2" key={item.id}>
            <div className="grid gap-2 justify-items-center items-center">
              <Button
                className="w-8 h-8 p-2 rounded-full text-muted"
                onClick={() => handleClick(item)}
                style={{ backgroundColor: item.color }}
              ></Button>
              <Button onClick={() => deleteColor(item)} variant="outline">
                Удалить
              </Button>
            </div>
            <div className="text-center text-zinc-500">{item.color}</div>
          </div>
        ))
      )}
    </div>
  );
};
