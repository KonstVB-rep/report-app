import { SerializedEquipmentItem } from "./types";

export const calculateKitTotal = (item: SerializedEquipmentItem): number => {
  if (!item.isKit || !item.contents) {
    return Number(item.price || 0);
  }

  return item.contents.reduce((total, kitEntry) => {
    return total + (Number(kitEntry.price) * kitEntry.count);
  }, 0);
};