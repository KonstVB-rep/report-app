import { useMemo, useState } from "react"
import debounce from "debounce" // убедитесь, что lodash установлен
import { ACTUAL_STATUS_DEAL } from "@/entities/deal/lib/constants"
import type { DealUnion } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { useSetHilight } from "../../api/hooks/mutate"

const ColorPickerDeal = () => {
  // Инициализируем начальным цветом из данных
  const { selectedDataItem } = useTableContext<DealUnion>()
  const [color, setColor] = useState(selectedDataItem?.highlights || "")
  const { mutate } = useSetHilight()

  const debouncedMutate = useMemo(
    () =>
      debounce((colorValue: string) => {
        if (!selectedDataItem || !selectedDataItem.userId) return
        mutate({
          id: selectedDataItem.id,
          type: selectedDataItem.type,
          color: colorValue,
          ownerId: selectedDataItem.userId,
        })
      }, 500),
    [mutate, selectedDataItem],
  )

  if (!selectedDataItem || selectedDataItem.dealStatus !== ACTUAL_STATUS_DEAL) return null

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    debouncedMutate(newColor)
  }

  const deleteColor = () => {
    setColor("")
    if (!selectedDataItem.userId) return
    mutate({
      id: selectedDataItem.id,
      type: selectedDataItem.type,
      color: null,
      ownerId: selectedDataItem.userId,
    })
  }

  return (
    <ModalContent className="max-w-[300px]">
      <div className="grid gap-4 p-4">
        <h2 className="text-center font-bold">Выберите цвет</h2>
        <Input
          className="h-12 cursor-pointer"
          onChange={handleColorChange}
          type="color"
          value={color}
        />
        <Button onClick={deleteColor} variant="outline">
          Удалить цвет
        </Button>
      </div>
    </ModalContent>
  )
}

export default ColorPickerDeal
