import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

export const utilsDataTable = {
  paramsFiltersToString: (arr: ColumnFiltersState) => {
    return arr
      .map((item) => `${item.id}=${JSON.stringify(item.value)}`)
      .join("&");
  },

  // Разбор строки URL в объект фильтров
  parsedParams: (str: string) => {
    if (!str) return [];
    return str.split("&").map((item) => {
      const [filterName, filterValue] = item.split("=");
      let value = filterValue.split(",");
      try {
        value = JSON.parse(filterValue);
      } catch (e) {
        console.error("Ошибка при разборе фильтров:", e);
      }
      return { id: filterName, value };
    });
  },

  // Преобразование скрытых колонок в строку URL
  transformHiddenColsFilterToString: (visibility: VisibilityState) =>
    Object.entries(visibility)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, isVisible]) => !isVisible)
      .map(([key]) => key)
      .join(","),

  // Разбор строки URL в объект скрытых колонок
  parsedHoddenColsFilter: (str: string) => {
    if (!str) return {};
    return Object.fromEntries(str.split(",").map((key) => [key, false]));
  },

  reduceSearchParams: (str: string, includeArr: string[]) => {
    if (!str) return {};

    const arr = str.split("&");

    return arr.reduce<{ [key: string]: string }>((acc, item) => {
      const innerItem = item.split("=");
      if (includeArr.includes(innerItem[0])) {
        acc[innerItem[0]] = innerItem[1].replace(/"/g, "");
      }
      return acc;
    }, {});
  },

  // Преобразование скрытых колонок в строку URL
  transformParamsListToStringArr(list: string, includedColumns: string[]) {
    return Object.values(this.reduceSearchParams(list, includedColumns));
  },

  // Преобразование скрытых колонок в строку URL
  transformParamsListToSFiltersObj(list: string, includedColumns: string[]) {
    return Object.keys(this.reduceSearchParams(list, includedColumns));
  },
};
