import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { mockOfferData } from "@/app/dashboard/offer-table/lib/mock"

// --- ТИПЫ ДАННЫХ ---

export type OfferTableItem = {
  id: string
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

// export type DataSubSection = { id: string; name: string; rows: OfferTableItem[] }
export type DataSection = { id: string; name: string; rows: OfferTableItem[] }
export type DataPart = { id: string; name: string; sections: DataSection[] }

export type DataOffer = {
  date: Date
  number: string
  parts: DataPart[]
}

// --- ИНТЕРФЕЙС СТОРА ---

interface OfferTableStore {
  data: DataOffer
  selectedItemId: string
  totalPriceOffer: string
  totalPricePurchase: string
  totalDelta: string

  setSelectedItemId: (id: string) => void
  updateOfferDate: (value: Date) => void
  updateOfferNumber: (value: string) => void

  updatePartTitle: (partId: string, value: string) => void
  updateSectionTitle: (partId: string, sectionId: string, value: string) => void
  // updateSubSectionTitle: (partId: string, sectionId: string,idvalue: string) => void

  addPart: () => void
  addSection: (partId: string) => void
  // addSubSection: (partId: string, sectionId: string) => void
  addRows: (partId: string, sectionId: string, iddata: OfferTableItem[]) => void

  removePart: (partId: string) => void
  removeSection: (partId: string, sectionId: string) => void
  // removeSubSection: (partId: string, sectionId: string, subId: string) => void
  removeRow: (partId: string, sectionId: string, idrowId: string) => void

  updateRow: (updatedItem: OfferTableItem) => void
  clearData: () => void
}

// --- ХЕЛПЕРЫ ДЛЯ ГЕНЕРАЦИИ СТРУКТУРЫ ---

const createEmptyRow = (): OfferTableItem => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  price: "0",
  count: 0,
  totalPrice: "0",
  purchasePrice: "0",
  purchaseAmount: "0",
  delta: "0",
})

// const createEmptySubSection = (): DataSubSection => ({
//   id: crypto.randomUUID(),
//   name: "Новый подраздел",
//   rows: [createEmptyRow()],
// })

const createEmptySection = (): DataSection => ({
  id: crypto.randomUUID(),
  name: "Новая секция",
  rows: [createEmptyRow()],
})

const createEmptyPart = (): DataPart => ({
  id: crypto.randomUUID(),
  name: "Новый раздел",
  sections: [createEmptySection()],
})

const Profit = 0.93

// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ПЕРЕСЧЕТА ---

const recalculateTotals = (state: OfferTableStore) => {
  // Используем let, потому что мы будем прибавлять к ним значения
  let totalOffer = 0
  let totalPurch = 0
  let totalDlt = 0

  // Просто проходим по всему дереву и суммируем
  state.data.parts.forEach((part) => {
    part.sections.forEach((sec) => {
      sec.rows.forEach((row) => {
        totalOffer += Number(row.totalPrice || 0)
        totalPurch += Number(row.purchaseAmount || 0)
        totalDlt += Number(row.delta || 0)
      })
    })
  })

  state.totalPriceOffer = totalOffer.toFixed(2)
  state.totalPricePurchase = totalPurch.toFixed(2)
  state.totalDelta = totalDlt.toFixed(2)
}

export const useOfferStoreTable = create<OfferTableStore>()(
  persist(
    immer((set) => ({
      // data: {
      //   date: new Date(),
      //   number: "",
      //   parts: [createEmptyPart()],
      // },
      data: mockOfferData,
      totalPriceOffer: "0",
      totalPricePurchase: "0",
      totalDelta: "0",
      selectedItemId: "",

      setSelectedItemId: (id) =>
        set((state) => {
          state.selectedItemId = id
        }),

      updateOfferDate: (date) =>
        set((state) => {
          state.data.date = date
        }),

      updateOfferNumber: (value) =>
        set((state) => {
          state.data.number = value
        }),

      updatePartTitle: (partId, value) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          if (part) part.name = value
        }),

      updateSectionTitle: (partId, sectionId, value) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (section) section.name = value
        }),

      // updateSubSectionTitle: (partId, sectionId, subId, value) =>
      //   set((state) => {
      //     const part = state.data.parts.find((p) => p.id === partId)
      //     const section = part?.sections.find((s) => s.id === sectionId)
      //     if (section) section.name = value
      //   }),

      addPart: () =>
        set((state) => {
          state.data.parts.push(createEmptyPart())
        }),

      addSection: (partId) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          if (part) part.sections.push(createEmptySection())
        }),

      // addSubSection: (partId, sectionId) =>
      //   set((state) => {
      //     const part = state.data.parts.find((p) => p.id === partId)
      //     const section = part?.sections.find((s) => s.id === sectionId)
      //     if (section) section.subSections.push(createEmptySubSection())
      //   }),

      addRows: (partId, sectionId, rows) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          // const sub = section?.subSections.find((ss) => ss.id === subId)
          if (section) {
            section.rows.push(...rows)
            recalculateTotals(state)
          }
        }),

      removePart: (partId) =>
        set((state) => {
          state.data.parts = state.data.parts.filter((p) => p.id !== partId)
          recalculateTotals(state)
        }),

      removeSection: (partId, sectionId) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          if (part) {
            part.sections = part.sections.filter((s) => s.id !== sectionId)
            recalculateTotals(state)
          }
        }),

      // removeSubSection: (partId, sectionId, subId) =>
      //   set((state) => {
      //     const part = state.data.parts.find((p) => p.id === partId)
      //     const section = part?.sections.find((s) => s.id === sectionId)
      //     if (section) {
      //       section.subSections = section.subSections.filter((ss) => ss.id !== subId)
      //       recalculateTotals(state)
      //     }
      //   }),

      removeRow: (partId, sectionId, rowId) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (section) {
            section.rows = section.rows.filter((r) => r.id !== rowId)
            recalculateTotals(state)
          }
        }),

      updateRow: (updatedItem) =>
        set((state) => {
          state.data.parts.forEach((part) => {
            part.sections.forEach((sec) => {
              const rowIndex = sec.rows.findIndex((r) => r.id === updatedItem.id)
              if (rowIndex !== -1) {
                const total = Number(updatedItem.price) * Number(updatedItem.count || 0)
                const purchase =
                  Number(updatedItem.purchasePrice || 0) * Number(updatedItem.count || 0)

                sec.rows[rowIndex] = {
                  ...updatedItem,
                  totalPrice: total.toFixed(2),
                  purchaseAmount: purchase.toFixed(2),
                  delta: (total * Profit - purchase).toFixed(2),
                }
              }
            })
          })
          recalculateTotals(state)
        }),

      clearData: () =>
        set((state) => {
          state.data = { date: new Date(), number: "", parts: [createEmptyPart()] }
          state.totalPriceOffer = "0"
          state.totalPricePurchase = "0"
          state.totalDelta = "0"
          state.selectedItemId = ""
        }),
    })),
    { name: "offer-table-storage" },
  ),
)

// Просто пробрасываем вызовы в стор. Никакого дублирования логики!
const act = () => useOfferStoreTable.getState()

export const selectData = (s: OfferTableStore) => s.data
export const selectParts = (s: OfferTableStore) => s.data.parts
export const selectTotals = (s: OfferTableStore) => ({
  offer: s.totalPriceOffer,
  purchase: s.totalPricePurchase,
  delta: s.totalDelta,
})
export const selectSelectedItemId = (s: OfferTableStore) => s.selectedItemId

export const addPart = () => act().addPart()
export const addSection = (pId: string) => act().addSection(pId)
// export const addSubSection = (pId: string, sId: string) => act().addSubSection(pId, sId);
export const addRows = (pId: string, sId: string, rows: OfferTableItem[]) =>
  act().addRows(pId, sId, rows)
export const updateRow = (item: OfferTableItem) => act().updateRow(item)
export const removeRow = (pId: string, sId: string, rId: string) => act().removeRow(pId, sId, rId)
export const updatePartTitle = (pId: string, val: string) => act().updatePartTitle(pId, val)
export const updateSectionTitle = (pId: string, sId: string, val: string) =>
  act().updateSectionTitle(pId, sId, val)
// export const updateSubSectionTitle = (pId: string, sId: string,idval: string) => act().updateSubSectionTitle(pId, sId, subId, val);
export const updateDate = (date: Date) => act().updateOfferDate(date)
export const updateNumber = (val: string) => act().updateOfferNumber(val)
export const removePart = (pId: string) => act().removePart(pId)
export const removeSection = (pId: string, sId: string) => act().removeSection(pId, sId)
// export const removeSubSection = (pId: string, sId: string, subId: string) => act().removeSubSection(pId, sId, subId);
export const setSelectedItemId = (id: string) => act().setSelectedItemId(id)
export const clearData = () => act().clearData()
