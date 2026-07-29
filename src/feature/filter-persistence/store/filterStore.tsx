import { createStore, type StoreApi } from "zustand"
import { persist } from "zustand/middleware"

type StoreColumnFilter = { id: string; value: unknown }
export type StoreColumnFiltersState = StoreColumnFilter[]
export type StoreVisibilityState = Record<string, boolean>

export type FilterStoreState = {
  columnFiltersStore: StoreColumnFiltersState
  columnVisibilityStore: StoreVisibilityState
  globalFilterStore: string
  selectedSearchColumnsStore: string[]
  openFiltersStore: boolean

  setColumnFiltersStore: (
    value: StoreColumnFiltersState | ((prev: StoreColumnFiltersState) => StoreColumnFiltersState),
  ) => void
  setColumnVisibilityStore: (
    value: StoreVisibilityState | ((prev: StoreVisibilityState) => StoreVisibilityState),
  ) => void
  setGlobalFilterStore: (value: string | ((prev: string) => string)) => void
  setSelectedSearchColumnsStore: (value: string[] | ((prev: string[]) => string[])) => void
  setOpenFiltersStore: (value: boolean | ((prev: boolean) => boolean)) => void
  resetFilterStore: () => void
}

export type FilterStoreInstanceType = StoreApi<FilterStoreState>

export const createFilterStore = (storageName: string): FilterStoreInstanceType => {
  return createStore<FilterStoreState>()(
    persist(
      (set) => ({
        columnFiltersStore: [],
        columnVisibilityStore: {},
        globalFilterStore: "",
        selectedSearchColumnsStore: [],
        openFiltersStore: false,

        setColumnFiltersStore: (value) =>
          set((state) => ({
            columnFiltersStore:
              typeof value === "function" ? value(state.columnFiltersStore) : value,
          })),
        setColumnVisibilityStore: (value) =>
          set((state) => ({
            columnVisibilityStore:
              typeof value === "function" ? value(state.columnVisibilityStore) : value,
          })),
        setGlobalFilterStore: (value) =>
          set((state) => ({
            globalFilterStore: typeof value === "function" ? value(state.globalFilterStore) : value,
          })),
        setSelectedSearchColumnsStore: (value) =>
          set((state) => ({
            selectedSearchColumnsStore:
              typeof value === "function" ? value(state.selectedSearchColumnsStore) : value,
          })),
        setOpenFiltersStore: (value) =>
          set((state) => ({
            openFiltersStore: typeof value === "function" ? value(state.openFiltersStore) : value,
          })),

        resetFilterStore: () => {
          set({
            columnFiltersStore: [],
            columnVisibilityStore: {},
            globalFilterStore: "",
            selectedSearchColumnsStore: [],
            openFiltersStore: false,
          })
        },
      }),
      {
        name: storageName,
        partialize: (state) => ({
          columnFiltersStore: state.columnFiltersStore,
          columnVisibilityStore: state.columnVisibilityStore,
          globalFilterStore: state.globalFilterStore,
          selectedSearchColumnsStore: state.selectedSearchColumnsStore,
        }),
      },
    ),
  )
}
