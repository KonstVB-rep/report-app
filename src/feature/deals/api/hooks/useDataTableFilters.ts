import { useCallback, useEffect, useRef, useState } from "react"
import type { ColumnFilter, ColumnFiltersState, VisibilityState } from "@tanstack/react-table"
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
  "inn",
] as const

type DateRangeValue = { from: Date; to: Date }
const isValidDate = (d: unknown): d is Date => d instanceof Date && !Number.isNaN(d.getTime())

const useDataTableFilters = (paramsNotFilters?: string[]) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Флаг-предохранитель, чтобы обновление URL не зацикливало обновление стейта
  const isUpdatingFromUrl = useRef(false)

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>(() => [
    ...SEARCHABLE_COLUMNS,
  ])
  const [openFilters, setOpenFilters] = useState(false)

  // 1. Функция парсинга параметров URL в стейт React
  const syncUrlToState = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    const filters: ColumnFiltersState = []
    const visibility: VisibilityState = {}

    params.forEach((value, key) => {
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

      // Обработка дат
      if (val.includes("..")) {
        const [fromStr, toStr] = val.split("..")
        const from = new Date(fromStr)
        const to = new Date(toStr)
        if (isValidDate(from) && isValidDate(to)) {
          filters.push({ id: key, value: { from, to } as DateRangeValue })
          return
        }
      }

      filters.push({
        id: key,
        value: val.includes(",") ? val.split(",") : val,
      })
    })

    isUpdatingFromUrl.current = true
    setColumnFilters(filters)
    setColumnVisibility(visibility)

    // Сбрасываем флаг в конце тика, чтобы разрешить updateUrl
    setTimeout(() => {
      isUpdatingFromUrl.current = false
    }, 50)
  }, [searchParams, paramsNotFilters])

  useEffect(() => {
    syncUrlToState()
  }, [syncUrlToState])

  const serializeValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.join(",")
    if (value && typeof value === "object" && "from" in value) {
      const range = value as DateRangeValue
      const from = isValidDate(range.from) ? range.from.toISOString().split("T")[0] : ""
      const to = isValidDate(range.to) ? range.to.toISOString().split("T")[0] : ""
      return from && to ? `${from}..${to}` : ""
    }
    return String(value ?? "")
  }

  const updateUrl = useDebounceCallback(
    (filters: ColumnFiltersState, visibility: VisibilityState, search: string) => {
      if (isUpdatingFromUrl.current) return

      // 1. Читаем ТЕКУЩИЙ ЖИВОЙ URL из адресной строки браузера (там сидит актуальный typeTab)
      const currentParams = new URLSearchParams(window.location.search)

      // 2. Создаем АБСОЛЮТНО ЧИСТЫЙ объект параметров для нового URL
      const params = new URLSearchParams()

      // 3. Из живого URL переносим только служебные вкладки из массива исключений [см. контекст]
      if (paramsNotFilters && paramsNotFilters.length > 0) {
        paramsNotFilters.forEach((key) => {
          const value = currentParams.get(key) // Читаем напрямую из окна браузера в рантайме
          if (value !== null) {
            params.set(key, value) // Жестко сохраняем вкладку "typeTab" нетронутой! [см. контекст]
          }
        })
      }

      // 4. Записываем только АКТУАЛЬНЫЕ фильтры таблицы из стейта React
      if (search.trim()) params.set("search", search.trim())

      filters.forEach((f: ColumnFilter) => {
        const s = serializeValue(f.value)
        if (s && s !== "null" && s !== "undefined") {
          params.set(f.id, s) // Сюда попадут только включенные чекбоксы
        }
      })

      const hidden = Object.keys(visibility).filter((k) => visibility[k] === false)
      if (hidden.length > 0) params.set("hidden", hidden.join(","))

      const newQuery = params.toString()
      const currentQuery = searchParams.toString()

      if (newQuery !== currentQuery) {
        router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, {
          scroll: false,
        })
      }
    },
    400,
  )

  // Следим за изменениями стейта (только для ручных фильтров в UI)
  useEffect(() => {
    updateUrl(columnFilters, columnVisibility, globalFilter)
  }, [columnFilters, columnVisibility, globalFilter, updateUrl])

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

export default useDataTableFilters
