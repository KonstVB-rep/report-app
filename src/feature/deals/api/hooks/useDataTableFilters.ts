// // src/feature/deals/api/hooks/useDataTableFilters.ts

// import { useDebounceCallback } from "@/shared/hooks/useDebounceCallback";
// import type {
//   ColumnFiltersState,
//   VisibilityState,
// } from "@tanstack/react-table";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useCallback, useEffect, useRef, useState } from "react";
// import type { DateRange } from "react-day-picker";

// export const SEARCHABLE_COLUMNS = [
//   "nameObject",
//   "nameDeal",
//   "contact",
//   "phone",
//   "email",
//   "comments",
//   "inn",
// ] as const;

// const clearNotFilterParams = (
//   delParamsFromFilter: (name: string) => void,
//   paramsNotFilters?: string[],
// ) => {
//   if (paramsNotFilters && paramsNotFilters.length > 0) {
//     paramsNotFilters.forEach((p) => {
//       delParamsFromFilter(p);
//     });
//   }
// };

// type FilterValue = string | string[] | { from: Date; to: Date };

// export const useDataTableFilters = (paramsNotFilters?: string[]) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const isInitialMount = useRef(true);

//   const [openFilters, setOpenFilters] = useState(false);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [globalFilter, setGlobalFilter] = useState<string>("");
//   const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>(
//     () => [...SEARCHABLE_COLUMNS],
//   );
//   console.log(columnFilters, "columnFilters");
//   // === ЧТЕНИЕ ИЗ URL ПРИ МОНТИРОВАНИИ ===
//   // biome-ignore lint/correctness/useExhaustiveDependencies: in time first render
//   useEffect(() => {
//     if (!isInitialMount.current) return;
//     isInitialMount.current = false;

//     const params = new URLSearchParams(searchParams);

//     clearNotFilterParams((p) => params.delete(p), paramsNotFilters);

//     const q = params.get("search");
//     if (q) setGlobalFilter(decodeURIComponent(q));

//     const filters: ColumnFiltersState = [];
//     params.forEach((value, key) => {
//       if (["search", "hidden"].includes(key)) return;

//       const values = value
//         .split(",")
//         .map((v) => decodeURIComponent(v.trim()))
//         .filter(Boolean);

//       if (values.length === 0) return;

//       if (values.length === 1 && values[0].includes("..")) {
//         const [fromStr, toStr] = values[0].split("..");
//         const from = new Date(fromStr);
//         const to = new Date(toStr);
//         if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime())) {
//           filters.push({ id: key, value: { from, to } });
//           return;
//         }
//       }

//       const filterValue: FilterValue = values.length === 1 ? values[0] : values;
//       filters.push({ id: key, value: filterValue });
//     });

//     if (filters.length > 0) setColumnFilters(filters);

//     const hidden = params.get("hidden");
//     if (hidden) {
//       const visibility: VisibilityState = {};
//       hidden.split(",").forEach((col) => {
//         visibility[col.trim()] = false;
//       });
//       setColumnVisibility((prev) => ({ ...prev, ...visibility }));
//     }
//   }, [pathname]);

//   // === ФУНКЦИЯ ДЛЯ ПРЕОБРАЗОВАНИЯ ЗНАЧЕНИЯ ФИЛЬТРА В СТРОКУ ===
//   const serializeFilterValue = (value: FilterValue): string => {
//     if (typeof value === "string") {
//       return value;
//     }
//     if (Array.isArray(value)) {
//       return value.join(",");
//     }
//     if (
//       value &&
//       typeof value === "object" &&
//       "from" in value &&
//       "to" in value
//     ) {
//       const from =
//         value.from instanceof Date
//           ? value.from.toISOString().split("T")[0]
//           : "";
//       const to =
//         value.to instanceof Date ? value.to.toISOString().split("T")[0] : "";
//       return `${from}..${to}`;
//     }
//     return "";
//   };

//   // === ОБНОВЛЕНИЕ URL ===
//   const updateUrl = useDebounceCallback(
//     (
//       filters: ColumnFiltersState,
//       visibility: VisibilityState,
//       search: string,
//     ) => {
//       const currentQuery = searchParams.toString();
//       const params = new URLSearchParams();

//       if (search.trim()) {
//         params.set("search", search.trim());
//       }

//       filters.forEach((filter) => {
//         if (filter.value == null) return;

//         const str = serializeFilterValue(filter.value as FilterValue);
//         if (str) {
//           params.set(filter.id, str);
//         }
//       });

//       const hiddenCols = Object.keys(visibility).filter(
//         (col) => !visibility[col],
//       );
//       if (hiddenCols.length > 0) {
//         params.set("hidden", hiddenCols.join(","));
//       }

//       const newQuery = params.toString();
//       if (newQuery === currentQuery) return;

//       router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, {
//         scroll: false,
//       });
//     },
//     400,
//   );

//   // biome-ignore lint/correctness/useExhaustiveDependencies: in time first render
//   useEffect(() => {
//     if (isInitialMount.current) return;
//     updateUrl(columnFilters, columnVisibility, globalFilter);
//   }, [columnFilters, columnVisibility, globalFilter]);

//   const handleDateChange = useCallback(
//     (columnId: string) => (range: DateRange | undefined) => {
//       setColumnFilters((prev) => {
//         const filtered = prev.filter((f) => f.id !== columnId);
//         if (range?.from && range?.to) {
//           return [
//             ...filtered,
//             { id: columnId, value: { from: range.from, to: range.to } },
//           ];
//         }
//         return filtered;
//       });
//     },
//     [],
//   );

//   const handleClearDateFilter = useCallback((columnId: string) => {
//     setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
//   }, []);

//   return {
//     columnFilters,
//     setColumnFilters,
//     columnVisibility,
//     setColumnVisibility,
//     globalFilter,
//     setGlobalFilter,

//     openFilters,
//     setOpenFilters,
//     selectedSearchColumns,
//     setSelectedSearchColumns,
//     searchableColumns: [...SEARCHABLE_COLUMNS],

//     handleDateChange,
//     handleClearDateFilter,
//   };
// };

// export default useDataTableFilters;

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

  // 4. Debounced обновление URL при изменении стейта вручную (внутри таблицы)
  const updateUrl = useDebounceCallback(
    (filters: ColumnFiltersState, visibility: VisibilityState, search: string) => {
      if (isUpdatingFromUrl.current) return

      const params = new URLSearchParams()
      if (search.trim()) params.set("search", search.trim())

      filters.forEach((f: ColumnFilter) => {
        const s = serializeValue(f.value)
        if (s && s !== "null" && s !== "undefined") params.set(f.id, s)
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
