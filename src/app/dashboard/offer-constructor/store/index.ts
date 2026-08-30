import { arrayMove } from "@dnd-kit/sortable"
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

  addPart: () => void
  addSection: (partId: string) => void
  addRows: (data: SerializedEquipmentItem[]) => void
  addRow: (partId: string, sectionId: string) => void

  removePart: (partId: string) => void
  removeSection: (partId: string, sectionId: string) => void
  removeRow: (partId: string, sectionId: string, idrowId: string) => void

  updateRow: (updatedItem: OfferTableItem) => void
  clearData: () => void
  movePart: (activeId: string, overId: string) => void
  moveSection: (activeId: string, overId: string) => void
  moveRow: (activeId: string, overId: string) => void
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

const createEmptySection = (): DataSection => ({
  id: crypto.randomUUID(),
  orderNumber: "",
  name: "Новая секция",
  rows: [createEmptyRow()],
  totalPrice: "0",
  totalPurchase: "0",
  totalDelta: "0",
})

const createEmptyPart = (): DataPart => ({
  id: crypto.randomUUID(),
  name: "Новый раздел",
  orderNumber: "",
  sections: [createEmptySection()],
})

const recalculateTotals = (state: OfferTableStore) => {
  let totalOffer = 0
  let totalPurch = 0
  let totalDlt = 0

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

      movePart: (activeId: string, overId: string) =>
        set((state) => {
          // Принудительно приводим к строке, чтобы исключить конфликты типов dnd-kit
          const targetActiveId = String(activeId)
          const targetOverId = String(overId)

          const oldIndex = state.data.parts.findIndex((p) => String(p.id) === targetActiveId)
          const newIndex = state.data.parts.findIndex((p) => String(p.id) === targetOverId)

          if (oldIndex !== -1 && newIndex !== -1) {
            state.data.parts = arrayMove(state.data.parts, oldIndex, newIndex)
          }
        }),

      moveSection: (activeId: string, overId: string) =>
        set((state) => {
          let activePartIdx = -1
          let activeSecIdx = -1
          let overPartIdx = -1
          let overSecIdx = -1

          // 1. Ищем, в каком разделе и на каком индексе лежит перетаскиваемый подраздел
          state.data.parts.forEach((part, pIdx) => {
            const sIdx = part.sections.findIndex((s) => s.id === activeId)
            if (sIdx !== -1) {
              activePartIdx = pIdx
              activeSecIdx = sIdx
            }
          })

          // 2. Ищем, куда его сбрасывают (над каким подразделом держим мышку)
          state.data.parts.forEach((part, pIdx) => {
            const sIdx = part.sections.findIndex((s) => s.id === overId)
            if (sIdx !== -1) {
              overPartIdx = pIdx
              overSecIdx = sIdx
            }
          })

          // 3. Если сбросили на пустой Раздел (над его шапкой), а не над конкретным подразделом
          if (overPartIdx === -1) {
            overPartIdx = state.data.parts.findIndex((p) => p.id === overId)
            overSecIdx = 0 // Вставляем в самое начало этого раздела
          }

          // 4. Если оба индекса найдены — выполняем перемещение внутри Immer массивов
          if (activePartIdx !== -1 && overPartIdx !== -1) {
            const activePart = state.data.parts[activePartIdx]
            const overPart = state.data.parts[overPartIdx]

            // Вырезаем подраздел из старого места
            const [movedSection] = activePart.sections.splice(activeSecIdx, 1)

            // Вставляем в новое место (в тот же или уже в другой раздел)
            overPart.sections.splice(overSecIdx, 0, movedSection)
          }
        }),

      moveRow: (activeRowId: string, overRowId: string) =>
        set((state) => {
          let activePartIdx = -1
          let activeSecIdx = -1
          let activeRowIdx = -1

          let overPartIdx = -1
          let overSecIdx = -1
          let overRowIdx = -1

          // 1. Ищем, где изначально лежит перетаскиваемая строка
          state.data.parts.forEach((part, pIdx) => {
            part.sections.forEach((sec, sIdx) => {
              const rIdx = sec.rows.findIndex((r) => r.rowId === activeRowId)
              if (rIdx !== -1) {
                activePartIdx = pIdx
                activeSecIdx = sIdx
                activeRowIdx = rIdx
              }
            })
          })

          // 2. Ищем, над какой строкой её сейчас удерживают
          state.data.parts.forEach((part, pIdx) => {
            part.sections.forEach((sec, sIdx) => {
              const rIdx = sec.rows.findIndex((r) => r.rowId === overRowId)
              if (rIdx !== -1) {
                overPartIdx = pIdx
                overSecIdx = sIdx
                overRowIdx = rIdx
              }
            })
          })

          // 3. Защита: если сбросили на пустой подраздел (над его шапкой), а не над строкой
          if (overPartIdx === -1) {
            state.data.parts.forEach((part, pIdx) => {
              const sIdx = part.sections.findIndex((s) => s.id === overRowId)
              if (sIdx !== -1) {
                overPartIdx = pIdx
                overSecIdx = sIdx
                overRowIdx = 0 // Кидаем в начало этого подраздела
              }
            })
          }

          // 4. Если нашли обе точки — выполняем перенос элемента в Immer-массиве
          if (activePartIdx !== -1 && overPartIdx !== -1) {
            const sourceRows = state.data.parts[activePartIdx].sections[activeSecIdx].rows
            const targetRows = state.data.parts[overPartIdx].sections[overSecIdx].rows

            // Вырезаем строку из старого подраздела
            const [movedRow] = sourceRows.splice(activeRowIdx, 1)

            // Вставляем строку в новый подраздел на нужную позицию
            targetRows.splice(overRowIdx, 0, movedRow)
          }
        }),

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

          const newItems = flattenKit(items)

          newItems.forEach((newItem) => {
            const existingRow = section.rows.find((r) => r.id === newItem.id)

            if (existingRow) {
              existingRow.count = (existingRow.count || 0) + (newItem.count || 1)
              const price = Number(existingRow.price || 0)
              existingRow.totalPrice = (price * existingRow.count).toString()
            } else {
              section.rows.push({
                ...newItem,
                rowId: crypto.randomUUID(),
                count: newItem.count || 1,
                totalPrice: newItem.totalPrice || newItem.price || "0",
              })
            }
          })

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
                  delta: (total - purchase).toFixed(2),
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
    {
      name: "offer-table-storage",
      partialize: (state) => ({
        ...state,
        data: {
          ...state.data,
          parts: state.data?.parts?.map((dataSection) => ({
            ...dataSection,
            sections: dataSection.sections?.map((dataRow) => ({
              ...dataRow,
              rows: dataRow.rows?.map((row) => {
                const { image, ...rest } = row
                return rest
              }),
            })),
          })),
        },
      }),
    },
  ),
)

const act = () => useOfferStoreTable.getState()

export const selectData = (s: OfferTableStore) => s.data
export const selectParts = (s: OfferTableStore) => s.data.parts

export const selectSectionsCount = (s: OfferTableStore) => {
  const sections = s.data.parts.map((p) => p.sections)

  return sections.flat().length
}
export const selectSetData = (data: DataOffer) => act().setData(data)

export const selectSetVat = (value: number) => act().setVat(value)

export const selectActiveTarget = (s: OfferTableStore) => s.activeTarget

export const setSelectActiveTarget = (partId: string, sectionId?: string) =>
  act().setActiveTarget(partId, sectionId)

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

export const selectSectionById =
  (partId: string, sectionId: string) => (state: OfferTableStore) => {
    const part = state.data.parts.find((p) => p.id === partId)
    return part?.sections.find((s) => s.id === sectionId) || null
  }
