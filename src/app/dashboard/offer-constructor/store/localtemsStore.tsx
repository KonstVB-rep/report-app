import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import type { EquipmentWithQuantity } from "../lib/types"

interface EquipmentStore {
  selectedKitId: string | null
  setSelectedKitId: (id: string | null) => void
  localKits: EquipmentWithQuantity[]
  setLocalKit: (data: EquipmentWithQuantity[]) => void
  localItems: Record<string, Partial<EquipmentWithQuantity>>
  updateLocalKit: (id: string, columnId: string, value: number | string) => void
  setLocalItem: (id: string, columnId: string, value: string | boolean | Date | null) => void
  resetLocalItems: () => void
}

export const useEquipmentStore = create<EquipmentStore>()(
  persist(
    immer((set) => ({
      selectedKitId: "",
      setSelectedKitId: (id) => set({ selectedKitId: id }),
      localKits: [],
      setLocalKit: (data) => set({ localKits: data }),
      updateLocalKit: (id, columnId, value) => {
        set((state) => ({
          localKits: state.localKits.map((kit: EquipmentWithQuantity) => {
            if (kit.id === id) {
              return { ...kit, [columnId]: value }
            }
            return kit
          }),
        }))
      },
      localItems: {},
      setLocalItem: (id, columnId, value) =>
        set((state) => ({
          localItems: {
            ...state.localItems,
            [id]: { ...state.localItems[id], [columnId]: value },
          },
        })),
      resetLocalItems: () => set({ localItems: {} }),
    })),
    { name: "local-equipment-storage" },
  ),
)

export const selectSetLocalItem = (
  id: string,
  columnId: string,
  value: string | boolean | Date | null,
) => {
  return useEquipmentStore.getState().setLocalItem(id, columnId, value)
}

export const selectedKitId = (s: EquipmentStore) => s.selectedKitId

export const selectSetSelectedKitId = (id: string | null) => {
  return useEquipmentStore.getState().setSelectedKitId(id)
}

export const selectLocalItems = (s: EquipmentStore) => s.localItems

export const selectedKits = (s: EquipmentStore) => s.localKits
export const selectSetLocalKit = (data: EquipmentWithQuantity[]) => {
  return useEquipmentStore.getState().setLocalKit(data)
}

export const selectResetLocalItems = () => useEquipmentStore.getState().resetLocalItems()

export const selectUpdateLocalKit = (id: string, columnId: string, value: number | string) => {
  return useEquipmentStore.getState().updateLocalKit(id, columnId, value)
}
