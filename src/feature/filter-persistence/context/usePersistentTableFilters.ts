import { useCallback, useEffect, useRef } from "react"
import type { ColumnFilter, ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { DateRange } from "react-day-picker"
import { useStore } from "zustand"
import { useDebounceCallback } from "@/shared/hooks/useDebounceCallback"
import { SEARCHABLE_COLUMNS } from "@/shared/lib/constants"
import {
  createFilterStore,
  type FilterStoreInstanceType,
  type FilterStoreState,
} from "../store/filterStore"

type DateRangeValue = { from: Date; to: Date }
const isValidDate = (d: unknown): d is Date => d instanceof Date && !Number.isNaN(d.getTime())

const serializeValue = (value: unknown): string => {
  if (Array.isArray(value)) return value.join(",")
  if (value && typeof value === "object" && "from" in value) {
    const range = value as DateRangeValue
    const from = isValidDate(new Date(range.from))
      ? new Date(range.from).toISOString().split("T")[0]
      : ""
    const to = isValidDate(new Date(range.to)) ? new Date(range.to).toISOString().split("T")[0] : ""
    return from && to ? `${from}..${to}` : ""
  }
  return String(value ?? "")
}

export const usePersistentTableFilters = (
  storageKey: string,
  paramsNotFilters?: string[],
  searchableCols?: string[],
) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const accessColsSearch = searchableCols || SEARCHABLE_COLUMNS

  const storeRef = useRef<FilterStoreInstanceType | null>(null)
  if (!storeRef.current) {
    storeRef.current = createFilterStore(`${storageKey}_filter_cache`)
  }
  const storeInstance = storeRef.current

  const columnFilters = useStore(storeInstance, (s: FilterStoreState) => s.columnFiltersStore)
  const columnVisibility = useStore(storeInstance, (s: FilterStoreState) => s.columnVisibilityStore)
  const globalFilter = useStore(storeInstance, (s: FilterStoreState) => s.globalFilterStore)
  const openFilters = useStore(storeInstance, (s: FilterStoreState) => s.openFiltersStore)
  const selectedSearchColumns = useStore(
    storeInstance,
    (s: FilterStoreState) => s.selectedSearchColumnsStore,
  )

  const setColumnFilters = useStore(storeInstance, (s: FilterStoreState) => s.setColumnFiltersStore)
  const setColumnVisibility = useStore(
    storeInstance,
    (s: FilterStoreState) => s.setColumnVisibilityStore,
  )
  const setGlobalFilter = useStore(storeInstance, (s: FilterStoreState) => s.setGlobalFilterStore)
  const setOpenFilters = useStore(storeInstance, (s: FilterStoreState) => s.setOpenFiltersStore)
  const setSelectedSearchColumns = useStore(
    storeInstance,
    (s: FilterStoreState) => s.setSelectedSearchColumnsStore,
  )
  const resetFilterStore = useStore(storeInstance, (s: FilterStoreState) => s.resetFilterStore)

  const isFirstHydration = useRef(true)

  const parseAndSetFilters = useCallback(
    (queryInput: URLSearchParams | string) => {
      const targetParams =
        typeof queryInput === "string" ? new URLSearchParams(queryInput) : queryInput

      const filters: ColumnFiltersState = []
      const visibility: VisibilityState = {}

      if (targetParams.size === 0) {
        resetFilterStore()
        return
      }

      targetParams.forEach((value, key) => {
        if (key === "viewType") return
        if (key === "search") {
          setGlobalFilter(decodeURIComponent(value))
          return
        }
        if (key === "hidden") {
          value.split(",").forEach((col) => {
            visibility[col.trim()] = false
          })
          return
        }
        if (paramsNotFilters?.includes(key)) return

        const val = decodeURIComponent(value)
        if (val.includes("..")) {
          const [fromStr, toStr] = val.split("..")
          const from = new Date(fromStr)
          const to = new Date(toStr)
          if (isValidDate(from) && isValidDate(to)) {
            filters.push({ id: key, value: { from, to } })
            return
          }
        }
        filters.push({ id: key, value: val.includes(",") ? val.split(",") : val })
      })

      setColumnFilters(filters)
      setColumnVisibility(visibility)
    },
    [paramsNotFilters, resetFilterStore, setColumnFilters, setColumnVisibility, setGlobalFilter],
  )

  useEffect(() => {
    if (!isFirstHydration.current || searchParams.size === 0) {
      isFirstHydration.current = false
      return
    }
    parseAndSetFilters(searchParams)
    isFirstHydration.current = false
  }, [parseAndSetFilters, searchParams])

  const syncStoreToUrl = useDebounceCallback(
    (filters: ColumnFiltersState, visibility: VisibilityState, search: string) => {
      if (isFirstHydration.current) return

      const currentParams = new URLSearchParams(window.location.search)
      const params = new URLSearchParams()

      const systemKeys = ["viewType", ...(paramsNotFilters || [])]
      systemKeys.forEach((key) => {
        const value = currentParams.get(key)
        if (value !== null) params.set(key, value)
      })

      if (search.trim()) params.set("search", search.trim())

      filters.forEach((f: ColumnFilter) => {
        const s = serializeValue(f.value)
        if (s && s !== "null" && s !== "undefined") params.set(f.id, s)
      })

      const hidden = Object.keys(visibility).filter((k) => visibility[k] === false)
      if (hidden.length > 0) params.set("hidden", hidden.join(","))

      const newQuery = params.toString()
      if (newQuery !== searchParams.toString()) {
        router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, {
          scroll: false,
        })
      }
    },
    350,
  )

  useEffect(() => {
    syncStoreToUrl(columnFilters, columnVisibility, globalFilter)
  }, [columnFilters, columnVisibility, globalFilter, syncStoreToUrl])

  return {
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    globalFilter,
    setGlobalFilter,
    openFilters,
    setOpenFilters,
    selectedSearchColumns,
    setSelectedSearchColumns,
    searchableColumns: [...accessColsSearch],
    resetFilterStore,
    parseAndSetFilters,

    handleDateChange: (columnId: string) => (range: DateRange | undefined) => {
      setColumnFilters((prev) => {
        const filtered = prev.filter((f) => f.id !== columnId)
        if (range?.from && range?.to) {
          return [...filtered, { id: columnId, value: { from: range.from, to: range.to } }]
        }
        return filtered
      })
    },
    handleClearDateFilter: (columnId: string) => {
      setColumnFilters((prev) => prev.filter((f) => f.id !== columnId))
    },
  }
}

export default usePersistentTableFilters
