import { EquipmentItem } from "@prisma/client"

export type Equipment = {
  id: string
  name: string
  image: string | null
  description: string
  price: string
  createdAt: Date
  updatedAt: Date
}

export type EquipmentDb = Omit<Equipment, "createdAt" | "updatedAt">
