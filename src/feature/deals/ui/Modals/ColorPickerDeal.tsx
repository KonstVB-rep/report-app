import { type Dispatch, type SetStateAction, useMemo, useState } from "react"
import type { UserHighlight } from "@prisma/client"
import debounce from "debounce"
import { useParams } from "next/navigation"
import { ACTUAL_STATUS_DEAL } from "@/entities/deal/lib/constants"
import { DEAL_TYPE, type DealUnion } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import { useSetHilight } from "../../api/hooks/mutate"
import { useGetHilightList } from "../../api/hooks/query"

const ColorPickerDeal = () => {
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
          userId: selectedDataItem.userId,
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

  const deleteColors = () => {
    setColor("")
    if (!selectedDataItem.userId) return
    mutate({
      id: selectedDataItem.id,
      type: selectedDataItem.type,
      color: null,
      userId: selectedDataItem.userId,
      all: true,
    })
  }

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
        <Button onClick={deleteColors} variant="outline">
          Удалить все
        </Button>
      </div>
    </ModalContent>
  )
}

export default ColorPickerDeal

type ColorsListUsedType = {
  color: string
  setColor: Dispatch<SetStateAction<string>>
}

const ColorsListUsed = ({ color, setColor }: ColorsListUsedType) => {
  const { data: colors } = useGetHilightList()
  const { userId } = useParams<{ userId: string }>()

  const { mutate } = useSetHilight()

  const debouncedMutate = useMemo(
    () =>
      debounce((item: UserHighlight) => {
        const id = item.projectId ?? item.retailId
        const realType = item.projectId ? DEAL_TYPE.PROJECT : DEAL_TYPE.RETAIL

        if (!id || !userId) return
        mutate({
          id,
          type: realType,
          color: item.color,
          userId: userId,
        })
      }, 500),
    [mutate, userId],
  )

  const deleteColor = (item: UserHighlight) => {
    const id = item.projectId ?? item.retailId
    const realType = item.projectId ? DEAL_TYPE.PROJECT : DEAL_TYPE.RETAIL

    if (!id || !userId) return
    setColor("")
    mutate({
      id,
      type: realType,
      color: null,
      userId: userId,
    })
  }

  if (!colors || !color.length) {
    return null
  }
  const handleClick = (item: UserHighlight) => {
    if (!item.color) return
    if (color === item.color) return
    setColor(item.color)
    debouncedMutate(item)
  }

  return (
    <div className="pt-2 flex overflow-x-auto gap-2">
      {colors?.map((item) => (
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
      ))}
    </div>
  )
}
