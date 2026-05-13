import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { flattenKit } from "../lib/flattenKit"
import type { SerializedEquipmentItem } from "../lib/types"

export type OfferTableItem = {
  rowId: string
  id: string
  name: string
  image?: string
  description?: string | null
  price?: string | null
  isKit: boolean
  count?: number
  totalPrice?: string
  purchasePrice?: string
  purchaseAmount?: string
  delta?: string
}

// export type DataSubSection = { id: string; name: string; rows: OfferTableItem[] }
export type DataSection = {
  id: string
  name: string
  orderNumber: string
  rows: OfferTableItem[]
  totalPrice: string
  totalPurchase: string
  totalDelta: string
}
export type DataPart = {
  id: string
  orderNumber: string
  name: string
  sections: DataSection[]
}

export type DataOffer = {
  date: Date
  number: string
  parts: DataPart[]
  vat: number
}

interface OfferTableStore {
  data: DataOffer
  selectedItemId: string
  totalPriceOffer: string
  totalPricePurchase: string
  totalDelta: string

  activeTarget: { partId: string; sectionId?: string } | null

  setData: (data: DataOffer) => void
  setVat: (value: number) => void
  setActiveTarget: (partId: string, sectionId?: string) => void
  resetActiveTarget: () => void

  setSelectedItemId: (id: string) => void
  updateOfferDate: (value: Date) => void
  updateOfferNumber: (value: string) => void

  updatePartTitle: (partId: string, value: string, orderNumber: string) => void
  updateSectionTitle: (
    partId: string,
    sectionId: string,
    value: string,
    orderNumber: string,
  ) => void
  // updateSubSectionTitle: (partId: string, sectionId: string,idvalue: string) => void

  addPart: () => void
  addSection: (partId: string) => void
  // addSubSection: (partId: string, sectionId: string) => void
  addRows: (data: SerializedEquipmentItem[]) => void
  addRow: (partId: string, sectionId: string) => void

  removePart: (partId: string) => void
  removeSection: (partId: string, sectionId: string) => void
  // removeSubSection: (partId: string, sectionId: string, subId: string) => void
  removeRow: (partId: string, sectionId: string, idrowId: string) => void

  updateRow: (updatedItem: OfferTableItem) => void
  clearData: () => void
}

const createEmptyRow = (): OfferTableItem => ({
  rowId: crypto.randomUUID(),
  id: crypto.randomUUID(),
  name: "",
  description: "",
  price: "0",
  isKit: false,
  count: 0,
  totalPrice: "0",
  purchasePrice: "0",
  purchaseAmount: "0",
  delta: "0",
})

// const counterOrderPartNumber = () => {
//   let num = 0;
//   return () => {
//     num++;
//     return num.toString();
//   };
// };

// const genOrderPartNumber = counterOrderPartNumber();

// const counterOrderSectionNumber = () => {
//   let num = 0;
//   return (partOrderNumber: string) => {
//     num++;
//     return `${partOrderNumber}.${num}`;
//   };
// };

// const genOrderSectionNumber = counterOrderSectionNumber();

const createEmptySection = (): DataSection => ({
  id: crypto.randomUUID(),
  orderNumber: "",
  name: "Новая секция",
  rows: [createEmptyRow()],
  totalPrice: "0",
  totalPurchase: "0",
  totalDelta: "0",
})

// const createEmptyPart = (): DataPart => ({
//   id: crypto.randomUUID(),
//   name: "Новый раздел",
//   orderNumber: genOrderPartNumber().toString(),
//   sections: [createEmptySection(genOrderPartNumber().toString())],
// });

const createEmptyPart = (): DataPart => ({
  id: crypto.randomUUID(),
  name: "Новый раздел",
  orderNumber: "",
  sections: [createEmptySection()],
})

const Profit = 0.95

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

const recalculateLocalTotal = (section: DataSection, rows: OfferTableItem[]) => {
  const totalPrice = rows.reduce((acc, row) => acc + Number(row.totalPrice || 0), 0)
  const totalPurchase = rows.reduce(
    (acc, row) => acc + Number(row.purchasePrice || 0) * Number(row.count),
    0,
  )
  const totalDelta = totalPrice - totalPurchase

  section.totalPrice = totalPrice.toFixed(2)
  section.totalPurchase = totalPurchase.toFixed(2)
  section.totalDelta = totalDelta.toFixed(2)
}

export const useOfferStoreTable = create<OfferTableStore>()(
  persist(
    immer((set) => ({
      data: {
        date: new Date(),
        number: "",
        parts: [createEmptyPart()],
        vat: 5,
      },
      totalPriceOffer: "0",
      totalPricePurchase: "0",
      totalDelta: "0",
      selectedItemId: "",
      activeTarget: null,
      setData: (data) =>
        set((state) => {
          state.data = data
        }),
      setVat: (value) =>
        set((state) => {
          state.data.vat = value
        }),
      setActiveTarget: (partId, sectionId) =>
        set((state) => {
          const isSamePart = state.activeTarget?.partId === partId
          const isSameSection = state.activeTarget?.sectionId === sectionId

          if (isSamePart && isSameSection) {
            state.activeTarget = null
          } else {
            state.activeTarget = { partId, sectionId }
          }
        }),
      setSelectedItemId: (id) =>
        set((state) => {
          state.selectedItemId = id
        }),

      resetActiveTarget: () =>
        set((state) => {
          state.activeTarget = null
        }),

      updateOfferDate: (date) =>
        set((state) => {
          state.data.date = date
        }),

      updateOfferNumber: (value) =>
        set((state) => {
          state.data.number = value
        }),

      updatePartTitle: (partId, value, orderNumber) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          if (part) {
            part.name = value
            part.orderNumber = orderNumber
          }
        }),

      updateSectionTitle: (partId, sectionId, value, orderNumber) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (section) {
            section.name = value
            section.orderNumber = orderNumber
          }
        }),

      addPart: () =>
        set((state) => {
          state.data.parts.push(createEmptyPart())
        }),

      addSection: () =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === state.activeTarget?.partId)
          if (!part) {
            toast.info("Выберите раздел куда вставить подраздел")
            return
          }
          part.sections.push(createEmptySection())
        }),
      addRows: (items: SerializedEquipmentItem[]) =>
        set((state) => {
          const { partId, sectionId } = state.activeTarget || {}
          if (!partId || !sectionId) {
            toast.info("Выберите раздел и подраздел")
            return
          }

          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (!section) return

          // 1. Разворачиваем комплекты в плоский список
          const newItems = flattenKit(items)

          console.log("newItems", newItems)

          newItems.forEach((newItem) => {
            // 2. Ищем существующую строку (по id оборудования из базы)
            const existingRow = section.rows.find((r) => r.id === newItem.id)

            if (existingRow) {
              // Суммируем количество
              existingRow.count = (existingRow.count || 0) + (newItem.count || 1)
              // Обновляем totalPrice строки
              const price = Number(existingRow.price || 0)
              existingRow.totalPrice = (price * existingRow.count).toString()
            } else {
              // Добавляем новую уникальную строку
              section.rows.push({
                ...newItem,
                rowId: crypto.randomUUID(), // Обязательно для стабильности TanStack Table
                count: newItem.count || 1,
                totalPrice: newItem.totalPrice || newItem.price || "0",
              })
            }
          })

          // 5. Глобальные пересчеты (суммы разделов, налоги и т.д.)
          recalculateLocalTotal(section, section.rows)
          recalculateTotals(state)
        }),

      addRow: (partId, sectionId) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)
          if (section) {
            section.rows.push(createEmptyRow())
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

      removeRow: (partId, sectionId, rowId) =>
        set((state) => {
          const part = state.data.parts.find((p) => p.id === partId)
          const section = part?.sections.find((s) => s.id === sectionId)

          if (section) {
            console.log(section.rows, "section.rows")
            section.rows = section.rows.filter((r) => r.rowId !== rowId)
            recalculateLocalTotal(section, section.rows)
            recalculateTotals(state)
          }
        }),

      updateRow: (updatedItem) =>
        set((state) => {
          state.data.parts.forEach((part) => {
            part.sections.forEach((sec) => {
              const rowIndex = sec.rows.findIndex((r) => r.rowId === updatedItem.rowId)
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
                recalculateLocalTotal(sec, sec.rows)
              }
            })
          })

          recalculateTotals(state)
        }),

      clearData: () =>
        set((state) => {
          state.data = {
            date: new Date(),
            number: "",
            parts: [createEmptyPart()],
            vat: 5,
          }
          state.totalPriceOffer = "0"
          state.totalPricePurchase = "0"
          state.totalDelta = "0"
          state.selectedItemId = ""
        }),
    })),
    { name: "offer-table-storage" },
  ),
)

const act = () => useOfferStoreTable.getState()

export const selectData = (s: OfferTableStore) => s.data
export const selectParts = (s: OfferTableStore) => s.data.parts
export const selectTotals = (s: OfferTableStore) => ({
  offer: s.totalPriceOffer,
  purchase: s.totalPricePurchase,
  delta: s.totalDelta,
})

export const selectSetData = (data: DataOffer) => act().setData(data)

export const selectSetVat = (value: number) => act().setVat(value)

export const selectActiveTarget = (s: OfferTableStore) => s.activeTarget

export const setSelectActiveTarget = (partId: string, sectionId?: string) =>
  act().setActiveTarget(partId, sectionId)

export const resetActiveTarget = () => act().resetActiveTarget()

export const addPart = () => act().addPart()
export const addSection = (pId: string) => act().addSection(pId)
export const addRows = (rows: SerializedEquipmentItem[]) => act().addRows(rows)
export const addRow = (pId: string, sId: string) => act().addRow(pId, sId)

export const updateRow = (item: OfferTableItem) => act().updateRow(item)
export const updatePartTitle = (pId: string, val: string, orderNumber: string) =>
  act().updatePartTitle(pId, val, orderNumber)
export const updateSectionTitle = (pId: string, sId: string, val: string, orderNumber: string) =>
  act().updateSectionTitle(pId, sId, val, orderNumber)
export const updateDate = (date: Date) => act().updateOfferDate(date)
export const updateNumber = (val: string) => act().updateOfferNumber(val)

export const removeRow = (pId: string, sId: string, rId: string) => act().removeRow(pId, sId, rId)
export const removePart = (pId: string) => act().removePart(pId)
export const removeSection = (pId: string, sId: string) => act().removeSection(pId, sId)

export const selectSelectedItemId = (s: OfferTableStore) => s.selectedItemId
export const setSelectedItemId = (id: string) => act().setSelectedItemId(id)
export const clearData = () => act().clearData()

export const selectSectionById =
  (partId: string, sectionId: string) => (state: OfferTableStore) => {
    const part = state.data.parts.find((p) => p.id === partId)
    return part?.sections.find((s) => s.id === sectionId) || null
  }

export const selectOrderNumberByPartId = (partId: string) => (state: OfferTableStore) => {
  const part = state.data.parts.find((p) => p.id === partId)
  return part?.orderNumber || ""
}

export const selectOrderNumberBySectionId =
  (partId: string, sectionId: string) => (state: OfferTableStore) => {
    const part = state.data.parts.find((p) => p.id === partId)
    const section = part?.sections.find((s) => s.id === sectionId)
    return section?.orderNumber || null
  }
