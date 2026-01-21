// src/feature/deals/api/hooks/useDataTableFilters.ts

import { useCallback, useEffect, useRef, useState } from "react"
import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { DateRange } from "react-day-picker"
import { useDebounceCallback } from "@/shared/hooks/useDebounceCallback"

export const SEARCHABLE_COLUMNS = [
  "nameObject",
  "nameDeal",
  "contact",
  "phone",
  "email",
  "comments",
] as const

// Тип для значения фильтра — поддерживаем строки, массивы и даты
type FilterValue = string | string[] | { from: Date; to: Date }

export const useDataTableFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  const [openFilters, setOpenFilters] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>(() => [
    ...SEARCHABLE_COLUMNS,
  ])

  // === ЧТЕНИЕ ИЗ URL ПРИ МОНТИРОВАНИИ ===
  // biome-ignore lint/correctness/useExhaustiveDependencies: in time first render
  useEffect(() => {
    if (!isInitialMount.current) return
    isInitialMount.current = false

    const params = new URLSearchParams(searchParams)

    const q = params.get("search")
    if (q) setGlobalFilter(decodeURIComponent(q))

    const filters: ColumnFiltersState = []
    params.forEach((value, key) => {
      if (["search", "hidden"].includes(key)) return

      const values = value
        .split(",")
        .map((v) => decodeURIComponent(v.trim()))
        .filter(Boolean)
      if (values.length === 0) return

      if (values.length === 1 && values[0].includes("..")) {
        const [fromStr, toStr] = values[0].split("..")
        const from = new Date(fromStr)
        const to = new Date(toStr)
        if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime())) {
          filters.push({ id: key, value: { from, to } })
          return
        }
      }

      const filterValue: FilterValue = values.length === 1 ? values[0] : values
      filters.push({ id: key, value: filterValue })
    })

    if (filters.length > 0) setColumnFilters(filters)

    const hidden = params.get("hidden")
    if (hidden) {
      const visibility: VisibilityState = {}
      hidden.split(",").forEach((col) => {
        visibility[col.trim()] = false
      })
      setColumnVisibility((prev) => ({ ...prev, ...visibility }))
    }
  }, [])

  // === ФУНКЦИЯ ДЛЯ ПРЕОБРАЗОВАНИЯ ЗНАЧЕНИЯ ФИЛЬТРА В СТРОКУ ===
  const serializeFilterValue = (value: FilterValue): string => {
    if (typeof value === "string") {
      return value
    }
    if (Array.isArray(value)) {
      return value.join(",")
    }
    if (value && typeof value === "object" && "from" in value && "to" in value) {
      const from = value.from instanceof Date ? value.from.toISOString().split("T")[0] : ""
      const to = value.to instanceof Date ? value.to.toISOString().split("T")[0] : ""
      return `${from}..${to}`
    }
    return ""
  }

  // === ОБНОВЛЕНИЕ URL ===
  const updateUrl = useDebounceCallback(
    (filters: ColumnFiltersState, visibility: VisibilityState, search: string) => {
      const currentQuery = searchParams.toString()
      const params = new URLSearchParams()

      if (search.trim()) {
        params.set("search", search.trim())
      }

      filters.forEach((filter) => {
        if (filter.value == null) return
        const str = serializeFilterValue(filter.value as FilterValue)
        if (str) {
          params.set(filter.id, str)
        }
      })

      const hiddenCols = Object.keys(visibility).filter((col) => !visibility[col])
      if (hiddenCols.length > 0) {
        params.set("hidden", hiddenCols.join(","))
      }

      const newQuery = params.toString()
      if (newQuery === currentQuery) return

      router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false })
    },
    400,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: in time first render
  useEffect(() => {
    if (isInitialMount.current) return
    updateUrl(columnFilters, columnVisibility, globalFilter)
  }, [columnFilters, columnVisibility, globalFilter])

  const handleDateChange = useCallback(
    (columnId: string) => (range: DateRange | undefined) => {
      setColumnFilters((prev) => {
        const filtered = prev.filter((f) => f.id !== columnId)
        if (range?.from && range?.to) {
          return [...filtered, { id: columnId, value: { from: range.from, to: range.to } }]
        }
        return filtered
      })
    },
    [],
  )

  const handleClearDateFilter = useCallback((columnId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId))
  }, [])

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
    searchableColumns: [...SEARCHABLE_COLUMNS],

    handleDateChange,
    handleClearDateFilter,
  }
}

export default useDataTableFilters
