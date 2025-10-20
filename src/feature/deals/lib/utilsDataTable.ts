import type { ColumnFiltersState, VisibilityState } from "@tanstack/react-table"

export const utilsDataTable = {
  /**
   * Преобразует массив фильтров в строку для URL.
   */
  paramsFiltersToString: (arr: ColumnFiltersState): string => {
    return arr.map((item) => `${item.id}=${JSON.stringify(item.value)}`).join("&")
  },

  /**
   * Разбирает строку URL в массив объектов фильтров.
   */
  parsedParams: (str: string): ColumnFiltersState => {
    if (!str) return []
    return str.split("&").map((item) => {
      const [filterName, filterValue] = item.split("=")
      try {
        return { id: filterName, value: JSON.parse(filterValue) }
      } catch (e) {
        console.error("Ошибка при разборе фильтров:", e)
        return { id: filterName, value: filterValue }
      }
    })
  },

  /**
   * Преобразует объект видимости колонок в строку для URL.
   */
  transformHiddenColsFilterToString: (visibility: VisibilityState): string => {
    return (
      Object.entries(visibility)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isVisible]) => !isVisible)
        .map(([key]) => key)
        .join(",")
    )
  },

  /**
   * Разбирает строку URL в объект видимости колонок.
   */
  parsedHiddenColsFilter: (str: string): VisibilityState => {
    if (!str) return {}
    return Object.fromEntries(str.split(",").map((key) => [key, false]))
  },

  /**
   * Фильтрует параметры строки запроса, оставляя только указанные ключи.
   */
  reduceSearchParams: (str: string, includeArr: string[]): Record<string, string> => {
    if (!str) return {}

    return str.split("&").reduce<Record<string, string>>((acc, item) => {
      const [key, value] = item.split("=")
      if (includeArr.includes(key)) {
        acc[key] = value.replace(/"/g, "")
      }
      return acc
    }, {})
  },

  /**
   * Возвращает массив значений фильтров из строки запроса.
   */
  transformParamsListToStringArr: (list: string, includedColumns: string[]): string[] => {
    const filteredParams = utilsDataTable.reduceSearchParams(list, includedColumns)
    return Object.values(filteredParams)
  },

  /**
   * Возвращает массив ключей фильтров из строки запроса.
   */
  transformParamsListToSFiltersObj: (list: string, includedColumns: string[]): string[] => {
    const filteredParams = utilsDataTable.reduceSearchParams(list, includedColumns)
    return Object.keys(filteredParams)
  },
}
