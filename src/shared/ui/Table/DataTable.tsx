"use client";

import React, { Fragment, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
} from "@tanstack/react-table";
import SelectColumns from "../SelectColumns";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../DateRangeFilter";
import { DealTypeLabels, LABELS } from "@/entities/deal/lib/constants";
import MultiColumnFilter from "../MultiColumnFilter";
import TableComponent from "./TableComponent";
import FilterPopoverGroup from "../Filters/FilterPopoverGroup";
import FilterByUser from "../Filters/FilterByUsers";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Settings2, X } from "lucide-react";
import TooltipComponent from "../TooltipComponent";
import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import TableRowsSkeleton from "../../../entities/deal/ui/Skeletons/TableRowsSkeleton";
import SaveFilter from "@/entities/deal/ui/Modals/SaveFilter";
import HoverCardComponent from "../HoverCard";
import useStoreUser from "@/entities/user/store/useStoreUser";
import FiltersManagment from "@/entities/deal/ui/FiltersManagment";

const userFiltersData = [
  {
    id: "1a2b3c",
    userId: "user123",
    filterName: "status",
    filterValue:
      "filters=deliveryType%3D%255B%2522SUPPLY%2522%255D%26direction%3D%255B%2522OTHER%2522%255D",
    isActive: true,
    createdAt: new Date("2024-03-20T12:00:00Z"),
    updatedAt: new Date("2024-03-25T14:30:00Z"),
  },
  {
    id: "4d5e6f",
    userId: "user456",
    filterName: "role",
    filterValue:
      "filters=deliveryType%3D%255B%2522SUPPLY%2522%255D%26direction%3D%255B%2522OTHER%2522%255D&hidden=nameDeal%2CnameObject%2Cdirection",
    isActive: false,
    createdAt: new Date("2024-02-15T09:20:00Z"),
    updatedAt: new Date("2024-03-10T10:45:00Z"),
  },
  {
    id: "7g8h9i",
    userId: "user789",
    filterName: "deliveryType",
    filterValue: "filters=deliveryType%3D%255B%2522SUPPLY%2522%255D",
    isActive: true,
    createdAt: new Date("2024-01-10T08:15:00Z"),
    updatedAt: new Date("2024-02-28T16:00:00Z"),
  },
  {
    id: "0j1k2l",
    userId: "user321",
    filterName: "subscription",
    filterValue:
      "filters=deliveryType%3D%255B%2522SUPPLY%2522%255D%26direction%3D%255B%2522OTHER%2522%255D%26dealStatus%3D%255B%2522PROGRESS%2522%252C%2522PAID%2522%255D&hidden=nameDeal%2CnameObject%2Cdirection",
    isActive: true,
    createdAt: new Date("2024-03-05T18:45:00Z"),
    updatedAt: new Date("2024-03-27T20:10:00Z"),
  },
];

const includedColumns = [
  "nameObject",
  "nameDeal",
  "contact",
  "phone",
  "email",
  "additionalContact",
  "comments",
];

// Преобразование параметров фильтра в строку URL
const paramsToString = (arr: ColumnFiltersState) =>
  arr
    .map(
      (item) => `${item.id}=${encodeURIComponent(JSON.stringify(item.value))}`
    )
    .join("&");

// Разбор строки URL в объект фильтров
const parsedParams = (str: string) => {
  if (!str) return [];
  return str.split("&").map((item) => {
    const [filterName, filterValue] = item.split("=");
    let value = filterValue.split(",");
    try {
      value = JSON.parse(decodeURIComponent(filterValue));
    } catch (e) {
      console.error("Ошибка при разборе фильтров:", e);
    }
    return { id: filterName, value };
  });
};

// Преобразование скрытых колонок в строку URL
const visibilityToString = (visibility: VisibilityState) =>
  Object.entries(visibility)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, isVisible]) => !isVisible)
    .map(([key]) => key)
    .join(",");

// Разбор строки URL в объект скрытых колонок
const parsedVisibility = (str: string) => {
  if (!str) return {};
  return Object.fromEntries(str.split(",").map((key) => [key, false]));
};

const reduceSearchPrams = (str: string, includeArr: string[]) => {
  if (!str) return {};

  const arr = decodeURIComponent(str).split("&");

  return arr.reduce<{ [key: string]: string }>((acc, item) => {
    const innerItem = item.split("=");
    if (includeArr.includes(innerItem[0])) {
      acc[innerItem[0]] = decodeURIComponent(innerItem[1]).replace(/"/g, "");
    }
    return acc;
  }, {});
};

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }, type: string) => string;
  type: keyof typeof DealTypeLabels;
  isPending: boolean;
}

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
  type,
  isPending,
}: DataTableProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dealType } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() =>
    Object.keys(reduceSearchPrams(searchParams.toString(), includedColumns))
  );
  const [filterValueSearchByCol, setFilterValueSearchByCol] = useState<string>(
    () =>
      Object.values(
        reduceSearchPrams(searchParams.toString(), includedColumns)
      )[0] || ""
  );

  const [openFilters, setOpenFilters] = useState(false);

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      columnVisibility: {
        resource: false,
        user: false,
      },
    },
  });


  const handleDateChange = (date: DateRange | undefined) => {
    setColumnFilters((prev) => {
      const newFilters = prev.filter((f) => f.id !== "dateRequest");

      if (date?.from && date?.to) {
        return [
          ...newFilters,
          { id: "dateRequest", value: { from: date.from, to: date.to } },
        ];
      }

      return newFilters;
    });
  };

  const handleClearDateFilter = (columnId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  };

  // const handleClearFilters = () => {
  //   setColumnFilters([]);
  //   setColumnVisibility({});

  //   setFilterInDb(null);
  // };

  // const filterSelect = (filterValue: string) => {
  //   const queryParams = new URLSearchParams(filterValue);

  //   const filters = decodeURIComponent(queryParams.get("filters") || "");

  //   const filtersArr = filters.split("&").map((filter) => {
  //     const [key, value]: string[] = filter.split("=");
  //     return {
  //       id: key,
  //       value: JSON.parse(decodeURIComponent(value)),
  //     };
  //   });

  //   const hiddenCols = queryParams
  //     .get("hidden")
  //     ?.split(",")
  //     ?.reduce(
  //       (acc, item) => {
  //         acc[item] = false;
  //         return acc;
  //       },
  //       {} as { [key: string]: boolean }
  //     );

  //   setColumnFilters(filtersArr ?? []);
  //   setColumnVisibility(hiddenCols ?? {});
  // };

  useEffect(() => {
    const initialFilters = parsedParams(
      decodeURIComponent(searchParams.get("filters") || "")
    );
    const initialVisibility = parsedVisibility(
      decodeURIComponent(searchParams.get("hidden") || "")
    );

    if (initialFilters.length) {
      setColumnFilters(initialFilters);
    }
    if (Object.keys(initialVisibility).length) {
      setColumnVisibility(initialVisibility);
    }

    console.log("useEffext1");
  }, [searchParams]);
  console.log(columnFilters, "columnFilters");
  // Сохраняем фильтры и скрытые колонки в URL при изменении
  useEffect(() => {
    const filtersString = paramsToString(columnFilters);
    const visibilityString = visibilityToString(columnVisibility);

    const queryParams = new URLSearchParams(searchParams.toString());

    if (filtersString) {
      queryParams.set("filters", filtersString);
    } else {
      queryParams.delete("filters");
    }

    if (visibilityString) {
      queryParams.set("hidden", visibilityString);
    } else {
      queryParams.delete("hidden");
    }
    console.log("useEffext2");
    router.replace(`${pathname}?${queryParams.toString()}`);
  }, [columnFilters, columnVisibility, pathname, router, searchParams]);

  return (
    <div className="relative grid max-h-[85vh] w-full overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex items-center justify-between gap-2 flex-1">
          {/* <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              onClick={() => setOpenFilters(!openFilters)}
              className="flex h-full w-fit justify-start gap-2 px-4"
            >
              <span>Фильтры</span>{" "}
              <ChevronDown
                className={`h-4 w-4 transition-all duration-200 ${openFilters ? "rotate-180" : ""}`}
              />
            </Button>
            {!openFilters && columnFilters.length > 0 && (
              <div className="flex h-8 w-8 items-center justify-center gap-2 rounded-md bg-muted p-1">
                {columnFilters.length}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {userFiltersData.length > 0 && (
              <HoverCardComponent title={<Settings2 />}>
                {userFiltersData.map((item) => {
                  return (
                    <div key={item.id} className="flex gap-1">
                      <span>{item.filterName}</span>
                      <Button
                        variant={"secondary"}
                        className="flex h-full w-fit justify-start gap-2 px-4"
                        onClick={() => filterSelect(item.filterValue)}
                      >
                        <Check />
                      </Button>
                      <Button
                        variant={"destructive"}
                        className="flex h-full w-fit justify-start gap-2 px-4"
                        onClick={handleClearFilters}
                      >
                        <X />
                      </Button>
                    </div>
                  );
                })}
              </HoverCardComponent>
            )}
            {searchParams.size > 0 && (
              <HoverCardComponent title={<Settings2 />}>
                {columnFilters.length ||
                Object.keys(columnVisibility).length ? (
                  <SaveFilter />
                ) : null}
                <TooltipComponent content="Сбросить фильтры">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="w-[50px] min-w-24 transition-transform duration-150 active:scale-95"
                    onClick={() => {
                      setColumnFilters([]);
                      setColumnVisibility({});
                      setSelectedColumns([]);
                    }}
                  >
                    <X />
                  </Button>
                </TooltipComponent>
              </HoverCardComponent>
            )}
          </div> */}
          <FiltersManagment
            setColumnFilters={setColumnFilters}
            setColumnVisibility={setColumnVisibility}
            setSelectedColumns={setSelectedColumns}
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
            columnFilters={columnFilters}
            columnVisibility={columnVisibility} 
            selectedColumns={[]}          
            />
        </div>
        <AddNewDeal type={dealType as string} />
      </div>
      <div
        className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0">
          <div>
            <FilterByUser
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          </div>
          <div className="flex justify-between gap-2">
            <DateRangeFilter
              onDateChange={handleDateChange}
              onClearDateFilter={handleClearDateFilter}
              value={value}
            />
            <MultiColumnFilter
              columns={columns}
              setColumnFilters={setColumnFilters}
              includedColumns={includedColumns}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              filterValueSearchByCol={filterValueSearchByCol}
              setFilterValueSearchByCol={setFilterValueSearchByCol}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 bg-background">
            <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
              <FilterPopoverGroup
                options={[
                  {
                    label: "Статус",
                    columnId: "dealStatus",
                    options: LABELS[type].STATUS,
                  },
                  {
                    label: "Направление",
                    columnId: "direction",
                    options: LABELS[type].DIRECTION,
                  },
                  {
                    label: "Тип поставки",
                    columnId: "deliveryType",
                    options: LABELS[type].DELIVERY,
                  },
                ]}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
              />
              <SelectColumns data={table} />
            </div>
          </div>
        </div>
      </div>

      {isPending ? (
        <TableRowsSkeleton />
      ) : data.length ? (
        <TableComponent table={table} getRowLink={getRowLink} />
      ) : (
        <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">
          Проекты не найдены
        </h1>
      )}
    </div>
  );
};

export default DataTable;
