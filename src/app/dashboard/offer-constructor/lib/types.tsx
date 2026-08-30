import type { DraggableAttributes } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"

export type DragHandleProps = {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
}
export type Equipment = {
  id: string
  name: string
  image: string | null
  description: string | null
  price: string | null
  isKit: boolean
  createdAt: Date
  updatedAt: Date
}

export type SerializedEquipmentItem = Equipment & {
  contents?: SerializedEquipmentKitItem[]
}

export type SerializedEquipmentKitItem = {
  id: string
  kitId: string
  itemId: string
  count: number
  price: string
  description: string
  item: SerializedEquipmentItem
}

export type EquipmentDb = Omit<Equipment, "createdAt" | "updatedAt">

export type EquipmentWithQuantity = SerializedEquipmentItem & {
  count: number
}
