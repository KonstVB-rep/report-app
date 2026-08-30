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

type DateRangeValue = {
  from?: Date
  to?: Date
}

const isValidDate = (d: unknown): d is Date => d instanceof Date && !Number.isNaN(d.getTime())

const serializeValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(",")
  }

  if (value && typeof value === "object" && "from" in value) {
    const range = value as DateRangeValue

    const fromDate = range.from ? new Date(range.from) : undefined
    const toDate = range.to ? new Date(range.to) : undefined

    const from = isValidDate(fromDate) ? fromDate.toISOString().split("T")[0] : ""

    const to = isValidDate(toDate) ? toDate.toISOString().split("T")[0] : ""

    return from && to ? `${from}..${to}` : ""
  }

  return String(value ?? "")
}

const usePersistentTableFilters = (
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

  const isReady = useRef(false)
  const hasMounted = useRef(false)
  const lastAppliedSearch = useRef<string | null>(null)
  const lastAppliedPathname = useRef<string | null>(null)

  const searchParamsString = searchParams.toString()

  const parseAndSetFilters = useCallback(
    (queryInput: URLSearchParams | string) => {
      const targetParams =
        typeof queryInput === "string" ? new URLSearchParams(queryInput) : queryInput

      if (targetParams.size === 0) {
        resetFilterStore()
        return
      }

      const filters: ColumnFiltersState = []
      const visibility: VisibilityState = {}

      targetParams.forEach((rawValue, key) => {
        if (key === "viewType") {
          return
        }

        if (key === "search") {
          setGlobalFilter(rawValue.trim())
          return
        }

        if (key === "hidden") {
          rawValue.split(",").forEach((col) => {
            const columnName = col.trim()

            if (columnName) {
              visibility[columnName] = false
            }
          })

          return
        }

        if (paramsNotFilters?.includes(key)) {
          return
        }

        if (!rawValue) {
          return
        }

        const value = rawValue

        if (value.includes("..")) {
          const [fromStr, toStr] = value.split("..")

          const from = new Date(fromStr)
          const to = new Date(toStr)

          if (isValidDate(from) && isValidDate(to)) {
            filters.push({
              id: key,
              value: { from, to },
            })

            return
          }
        }

        filters.push({
          id: key,
          value: value.includes(",") ? value.split(",").map((item) => item.trim()) : value,
        })
      })

      setColumnFilters(filters)
      setColumnVisibility(visibility)
    },
    [paramsNotFilters, resetFilterStore, setColumnFilters, setColumnVisibility, setGlobalFilter],
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const searchFromNext = searchParamsString ? `?${searchParamsString}` : ""

    const currentSearch = window.location.search || searchFromNext
    const currentPathname = window.location.pathname || pathname

    if (
      lastAppliedSearch.current === currentSearch &&
      lastAppliedPathname.current === currentPathname
    ) {
      isReady.current = true
      return
    }

    lastAppliedSearch.current = currentSearch
    lastAppliedPathname.current = currentPathname

    const params = new URLSearchParams(currentSearch)

    if (params.size > 0 || hasMounted.current) {
      parseAndSetFilters(params)
    }

    hasMounted.current = true
    isReady.current = true
  }, [searchParamsString, pathname, parseAndSetFilters])

  const syncStoreToUrl = useDebounceCallback(
    (filters: ColumnFiltersState, visibility: VisibilityState, search: string) => {
      if (!isReady.current || typeof window === "undefined") {
        return
      }

      const currentParams = new URLSearchParams(window.location.search)
      const params = new URLSearchParams()

      const systemKeys = ["viewType", ...(paramsNotFilters || [])]

      systemKeys.forEach((key) => {
        const value = currentParams.get(key)

        if (value !== null) {
          params.set(key, value)
        }
      })

      const trimmedSearch = search.trim()

      if (trimmedSearch) {
        params.set("search", trimmedSearch)
      }

      filters.forEach((filter: ColumnFilter) => {
        const serializedValue = serializeValue(filter.value)

        if (serializedValue && serializedValue !== "null" && serializedValue !== "undefined") {
          params.set(filter.id, serializedValue)
        }
      })

      const hiddenColumns = Object.keys(visibility).filter(
        (columnKey) => visibility[columnKey] === false,
      )

      if (hiddenColumns.length > 0) {
        params.set("hidden", hiddenColumns.join(","))
      }

      const newQuery = params.toString()
      const newSearch = newQuery ? `?${newQuery}` : ""

      if (newSearch === window.location.search) {
        return
      }

      lastAppliedSearch.current = newSearch
      lastAppliedPathname.current = window.location.pathname

      router.replace(newSearch ? `${pathname}${newSearch}` : pathname, {
        scroll: false,
      })
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
      setColumnFilters((prev: ColumnFiltersState) => {
        const filtered = prev.filter((filter) => filter.id !== columnId)

        if (range?.from && range?.to) {
          return [
            ...filtered,
            {
              id: columnId,
              value: {
                from: range.from,
                to: range.to,
              },
            },
          ]
        }

        return filtered
      })
    },

    handleClearDateFilter: (columnId: string) => {
      setColumnFilters((prev: ColumnFiltersState) =>
        prev.filter((filter) => filter.id !== columnId),
      )
    },
  }
}

export default usePersistentTableFilters
