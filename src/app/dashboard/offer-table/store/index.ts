import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type OfferTableItem = {
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

export type DataSubSection = {
  id: string
  name: string
  rows: OfferTableItem[]
}

export type DataSection = {
  id: string
  name: string
  subSections: DataSubSection[]
}

export type DataPart = {
  id: string
  name: string
  sections: DataSection[]
}

export type DataOffer = {
  date: Date
  number: string
  parts: DataPart[]
}

interface OfferTableStore {
  dataParts: DataOffer
  selectedItemId: string
  setSelectedItemId: (id: string) => void
  updateOfferDate: (value: Date) => void
  updateOfferNumber: (value: string) => void
  updatePartTitle: (partId: string, value: string) => void
  updateSectionTitle: (partId: string, sectionId: string, value: string) => void
  updateSubSectionTitle: (partId: string, sectionId: string, subId: string, value: string) => void
  addPart: () => void
  addSection: (partId: string) => void
  addSubSection: (partId: string, sectionId: string) => void
  removePart: (partId: string) => void
  removeSection: (partId: string, sectionId: string) => void
  removeSubSection: (partId: string, sectionId: string, subId: string) => void
  // setData: (data: OfferTableItem[]) => void;
  addRows: (partId: string, sectionId: string, subId: string, data: OfferTableItem[]) => void
  removeRow: (partId: string, sectionId: string, subId: string, rowId: string) => void
  updateRow: (updatedItem: OfferTableItem) => void
  clearData: () => void
  totalPriceOffer: string
  totalPricePurchase: string
  totalDelta: string
}

const createEmptyRow = (): OfferTableItem => ({
  id: crypto.randomUUID(),
  name: "",
  image: "",
  description: "",
  price: "0",
  count: 0,
  totalPrice: "0",
  purchasePrice: "0",
  purchaseAmount: "0",
  delta: "0",
})

const createEmptySubSection = (): DataSubSection => ({
  id: crypto.randomUUID(),
  name: "",
  rows: [createEmptyRow()], // Сразу со строкой
})

const createEmptySection = (): DataSection => ({
  id: crypto.randomUUID(),
  name: "",
  subSections: [createEmptySubSection()],
})

const createPart = (): DataPart => ({
  id: crypto.randomUUID(),
  name: "",
  sections: [createEmptySection()],
})

const Profit = 0.93

export const useOfferStoreTable = create<OfferTableStore>()(
  persist(
    immer((set) => ({
      dataParts: {
        date: new Date(),
        number: "",
        parts: [createPart()],
      },
      totalPriceOffer: "0",
      totalPricePurchase: "0",
      totalDelta: "0",
      selectedItemId: "",
      setSelectedItemId: (id: string) => set({ selectedItemId: id }),
      addPart: () =>
        set((state) => {
          state.dataParts.parts.push(createPart())
        }),

      addSection: (partId: string) =>
        set((state) => {
          if (!partId) {
            toast.info("Выберите раздел куда вставить подраздел")
            return
          }
          const part = state.dataParts.parts.find((p) => p.id === partId)
          if (part) {
            part.sections.push(createEmptySection())
          }
        }),

      addSubSection: (partId, sectionId) =>
        set((state) => {
          const part = state.dataParts.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (section) {
            section.subSections.push(createEmptySubSection())
          }
        }),
      updateOfferDate: (date: Date) =>
        set((state) => ({
          ...state,
          dataParts: {
            ...state.dataParts,
            date,
          },
        })),
      updateOfferNumber: (value: string) =>
        set((state) => ({
          ...state,
          dataParts: {
            ...state.dataParts,
            number: value,
          },
        })),

      updatePartTitle: (partId: string, value: string) =>
        set((state) => ({
          ...state,
          dataParts: {
            ...state.dataParts,
            parts: state.dataParts.parts.map((p) => (p.id === partId ? { ...p, name: value } : p)),
          },
        })),

      updateSectionTitle: (partId: string, sectionId: string, value: string) =>
        set((state) => {
          state.dataParts.parts.forEach((part) => {
            if (part.id === partId) {
              part.sections.forEach((section) => {
                if (section.id === sectionId) {
                  section.name = value
                }
              })
            }
          })
        }),
      updateSubSectionTitle: (partId: string, sectionId: string, subId: string, value: string) =>
        set((state) => {
          state.dataParts.parts.forEach((part) => {
            if (part.id === partId) {
              part.sections.forEach((section) => {
                if (section.id === sectionId) {
                  section.subSections.forEach((sub) => {
                    if (sub.id === subId) {
                      sub.name = value
                    }
                  })
                }
              })
            }
          })
        }),

      removePart: (partId: string) =>
        set((state) => {
          state.dataParts.parts = state.dataParts.parts.filter((p) => p.id !== partId)
        }),
      removeSection: (partId, sectionId) =>
        set((state) => {
          const part = state.dataParts.parts.find((p) => p.id === partId)
          if (part) {
            part.sections = part.sections.filter((s) => s.id !== sectionId)
          }
        }),

      removeSubSection: (partId, sectionId, subId) =>
        set((state) => {
          const part = state.dataParts.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (section) {
            section.subSections = section.subSections.filter((sub) => sub.id !== subId)
          }
        }),

      // setData: (data) => set((state) => state.dataParts.parts = data),

      addRows: (partId, sectionId, subId, data) =>
        set((state) => {
          const part = state.dataParts.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          const sub = section?.subSections.find((ss) => ss.id === subId)

          if (sub) {
            sub.rows.push(...data)
          }
        }),
      removeRow: (partId, sectionId, subId, rowId) =>
        set((state) => {
          const part = state.dataParts.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          const sub = section?.subSections.find((ss) => ss.id === subId)

          if (sub) {
            sub.rows = sub.rows.filter((row) => row.id !== rowId)
          }
        }),
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
    })),
    {
      name: "offer-table-storage",
    },
  ),
)

export const selectParts = (state: OfferTableStore) => state.dataParts
export const selectItemStoreId = (state: OfferTableStore) => state.selectedItemId
export const selectItemStoreIdAction = (id: string) =>
  useOfferStoreTable.getState().setSelectedItemId(id)

export const addRows = (data: OfferTableItem[]) => useOfferStoreTable.getState().addRows(data)
export const addPart = () => useOfferStoreTable.getState().addPart()
export const addSection = (partId: string) => useOfferStoreTable.getState().addSection(partId)
export const addSubSection = (partId: string, sectionId: string) =>
  useOfferStoreTable.getState().addSubSection(partId, sectionId)

export const removePart = (partId: string) => useOfferStoreTable.getState().removePart(partId)
export const removeSection = (partId: string, sectionId: string) =>
  useOfferStoreTable.getState().removeSection(partId, sectionId)
export const removeSubSection = (partId: string, sectionId: string, subId: string) =>
  useOfferStoreTable.getState().removeSubSection(partId, sectionId, subId)
export const removeRow = (partId: string, sectionId: string, subId: string, rowId: string) =>
  useOfferStoreTable.getState().removeRow(partId, sectionId, subId, rowId)

export const updateRow = (updatedItem: OfferTableItem) =>
  useOfferStoreTable.getState().updateRow(updatedItem)

export const updateOfferNumber = (value: string) =>
  useOfferStoreTable.getState().updateOfferNumber(value)

export const updatePartTitle = (partId: string, value: string) =>
  useOfferStoreTable.getState().updatePartTitle(partId, value)

export const updateDate = (value: Date) => useOfferStoreTable.getState().updateOfferDate(value)

export const updateSectionTitle = (partId: string, sectionId: string, value: string) =>
  useOfferStoreTable.getState().updateSectionTitle(partId, sectionId, value)
export const updateSubSectionTitle = (
  partId: string,
  sectionId: string,
  subId: string,
  value: string,
) => useOfferStoreTable.getState().updateSubSectionTitle(partId, sectionId, subId, value)
