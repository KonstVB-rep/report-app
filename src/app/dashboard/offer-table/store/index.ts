import { create } from "zustand"
import { persist } from "zustand/middleware"

type OfferTableItem = {
  id: string | number
  name: string
  image?: string
  description: string
  price: string
  count?: number
  totalPrice?: string
  purchasePrice?: string
  purchaseAmount?: string
  delta?: string
}

interface OfferTableStore {
  dataTable: OfferTableItem[]
  setData: (data: OfferTableItem[]) => void
  addRows: (newItem: OfferTableItem[]) => void
  removeRow: (id: string | number) => void
  updateRow: (updatedItem: OfferTableItem) => void
  clearData: () => void
  totalPriceOffer: string
  totalPricePurchase: string
  totalDelta: string
}

const Profit = 0.93

export const useOfferStoreTable = create<OfferTableStore>()(
  persist(
    (set) => ({
      dataTable: [],
      totalPriceOffer: "0",
      totalPricePurchase: "0",
      totalDelta: "0",

      setData: (data) => set({ dataTable: data }),
      addRows: (newItems: OfferTableItem[]) =>
        set((state) => ({
          dataTable: [...state.dataTable, ...newItems],
        })),
      removeRow: (id: string | number) =>
        set((state) => ({
          dataTable: state.dataTable.filter((item) => item.id !== id),
        })),
      updateRow: (updatedItem: OfferTableItem) => {
        set((state) => ({
          dataTable: state.dataTable.map((item) => {
            if (item.id === updatedItem.id) {
              const totalPrice = Number(updatedItem.price) * Number(updatedItem.count)

              const purchaseAmount = Number(updatedItem.purchasePrice) * Number(updatedItem.count)

              const delta = totalPrice * Profit - purchaseAmount

              return {
                ...updatedItem,
                totalPrice: String(totalPrice),
                purchaseAmount: String(purchaseAmount),
                delta: String(delta),
              }
            }
            return item
          }),
          totalPriceOffer: String(
            state.dataTable.reduce((acc, item) => (acc += Number(item.price)), 0),
          ),
          totalPricePurchase: String(
            state.dataTable.reduce((acc, item) => (acc += Number(item.purchasePrice)), 0),
          ),
          totalDelta: String(state.dataTable.reduce((acc, item) => (acc += Number(item.delta)), 0)),
        }))
      },
      updateRowDb: (updatedItem: OfferTableItem) => {},
      clearData: () => set({ dataTable: [] }),
    }),
    {
      name: "offer-table-storage",
    },
  ),
)

export const addRows = (data: OfferTableItem[]) => useOfferStoreTable.getState().addRows(data)
export const removeRow = (id: string | number) => useOfferStoreTable.getState().removeRow(id)
export const updateRow = (updatedItem: OfferTableItem) =>
  useOfferStoreTable.getState().updateRow(updatedItem)
