import type { DraggableAttributes } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import type { Decimal } from "@prisma/client/runtime/client"

// Описываем строгий интерфейс для пропсов ручки захвата
export type DragHandleProps = {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
}

// 1. Базовый тип оборудования
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

// 2. Основной тип оборудования (с учетом вложенности)
export type SerializedEquipmentItem = Equipment & {
  contents?: SerializedEquipmentKitItem[]
}

// 3. Строка внутри комплекта (связующее звено)
export type SerializedEquipmentKitItem = {
  id: string
  kitId: string
  itemId: string
  count: number
  price: string
  description: string
  item: SerializedEquipmentItem
}

// 4. Вспомогательные типы
export type EquipmentDb = Omit<Equipment, "createdAt" | "updatedAt">

// Тип для таблиц конструктора (с количеством)
export type EquipmentWithQuantity = SerializedEquipmentItem & {
  count: number
}

export type EquipmentItemKit = Equipment & {
  contents?: EquipmentDb[]
}

// Тип для создания/обновления связей в БД
// export type EquipmentKitSchema = {
//   kitId: string;
//   itemId: string;
//   count: number;
//   price: string | null;
//   description: string;
// };

export type EquipmentPriceDecimal = {
  id: string
  kitId: string
  count: number
  itemId: string
  description: string | null
  price: Decimal | null
}

export type SerializedEquipmentItemPriceDecimal = EquipmentPriceDecimal & {
  contents?: SerializedEquipmentKitItem[]
}

// 3. Строка внутри комплекта (связующее звено)
export type SerializedEquipmentKitItemPriceDecimal = {
  id: string
  kitId: string
  itemId: string
  count: number
  price: Decimal | null
  description: string
  item: SerializedEquipmentItemPriceDecimal
  createdAt: Date
  updatedAt: Date
}
