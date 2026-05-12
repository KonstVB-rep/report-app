import type { OfferTableItem } from "../store"
import type { SerializedEquipmentItem } from "./types"
export const flattenKit = (items: SerializedEquipmentItem[]): OfferTableItem[] => {
  const result: OfferTableItem[] = []

  items.forEach((item) => {
    if (item.isKit && Array.isArray(item.contents) && item.contents.length > 0) {
      const subItems = item.contents.map((kitEntry) => kitEntry.item)
      result.push(...flattenKit(subItems))
    } else {
      result.push({
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image ?? undefined,
        price: item.price,
        isKit: false,
        count: 1,
        totalPrice: item.price || "0",
        purchasePrice: item.price || "0",
        purchaseAmount: item.price || "0",
        delta: "0",
      } as OfferTableItem)
    }
  })
  return result
}
