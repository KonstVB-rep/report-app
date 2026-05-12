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
