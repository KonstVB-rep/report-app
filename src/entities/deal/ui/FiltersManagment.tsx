"use client";

import { Button } from "@/components/ui/button";
import HoverCardComponent from "@/shared/ui/HoverCard";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import { ChevronDown, ListFilterPlus, Settings2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import SaveFilter from "./Modals/SaveFilter";
import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { UserFilter } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const userFiltersData: UserFilter[] = [
  {
    id: "1a2b3c",
    userId: "user123",
    filterName: "status",
    filterValue:
      "filters=deliveryType%3D%255B%2522SUPPLY%2522%255D%26direction%3D%255B%2522OTHER%2522%255D",
    isActive: false,
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
    isActive: false,
    createdAt: new Date("2024-01-10T08:15:00Z"),
    updatedAt: new Date("2024-02-28T16:00:00Z"),
  },
  {
    id: "0j1k2l",
    userId: "user321",
    filterName: "subscription",
    filterValue:
      "filters=deliveryType%3D%255B%2522SUPPLY%2522%255D%26direction%3D%255B%2522OTHER%2522%255D%26dealStatus%3D%255B%2522PROGRESS%2522%252C%2522PAID%2522%255D&hidden=nameDeal%2CnameObject%2Cdirection",
    isActive: false,
    createdAt: new Date("2024-03-05T18:45:00Z"),
    updatedAt: new Date("2024-03-27T20:10:00Z"),
  },
];

type FilterManagmentProps = {
  openFilters: boolean;
  setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: Dispatch<React.SetStateAction<VisibilityState>>;
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
};

const FiltersManagment = ({
  setColumnFilters,
  setColumnVisibility,
  openFilters,
  setOpenFilters,
  columnFilters,
  columnVisibility,
  setSelectedColumns,
}: FilterManagmentProps) => {
  const searchParams = useSearchParams();

  const [selectedFilterName, setSelectedFilterName] = useState<string>("");

  const defaultCheckedFilter = userFiltersData.find((item) => item.isActive);

  const handleClearFilters = () => {
    setColumnFilters([]);
    setColumnVisibility({});
    setSelectedFilterName("");
  };

  const filterSelect = useCallback(
    (filterValue: string, name: string) => {
      console.log("************************filterValue", filterValue);
      if (!filterValue) return;

      if (selectedFilterName === name) return;
      setSelectedFilterName(name);

      const queryParams = new URLSearchParams(filterValue);

      const filters = decodeURIComponent(queryParams.get("filters") || "");

      const filtersArr: {
        id: string;
        value: unknown;
      }[] = filters.split("&").map((filter) => {
        const [key, value] = filter.split("=");
        return {
          id: key,
          value: JSON.parse(decodeURIComponent(value)),
        };
      });

      const hiddenCols = queryParams
        .get("hidden")
        ?.split(",")
        ?.reduce(
          (acc, item) => {
            acc[item] = false;
            return acc;
          },
          {} as { [key: string]: boolean }
        );

      setColumnFilters((filtersArr as unknown as ColumnFiltersState) ?? []);
      setColumnVisibility(hiddenCols ?? {});
    },
    [selectedFilterName, setColumnFilters, setColumnVisibility]
  );

  useEffect(() => {
    if (defaultCheckedFilter) {
      filterSelect(
        defaultCheckedFilter.filterValue,
        defaultCheckedFilter.filterName
      );
    }
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
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
        {searchParams.size > 0 && (
          <HoverCardComponent title={<Settings2 />}>
            {columnFilters.length || Object.keys(columnVisibility).length ? (
              <SaveFilter />
            ) : null}
            <TooltipComponent content="Сбросить фильтры">
              <Button
                variant={"destructive"}
                size={"icon"}
                className="w-[50px] min-w-24 transition-transform duration-150 active:scale-95"
                onClick={() => {
                  handleClearFilters();
                  setSelectedColumns([]);
                }}
              >
                <X />
              </Button>
            </TooltipComponent>
          </HoverCardComponent>
        )}
        {userFiltersData.length > 0 && (
          <HoverCardComponent title={<ListFilterPlus />}>
            <RadioGroup
              defaultValue={
                defaultCheckedFilter?.filterName || "disableSavedFilters"
              }
              className="p-2"
            >
              {userFiltersData.map((item) => {
                return (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={item.filterName}
                      id={item.id}
                      onClick={() =>
                        filterSelect(item.filterValue, item.filterName)
                      }
                    />
                    <Label htmlFor={item.id} className="first-letter:uppercase">
                      {item.filterName}
                    </Label>
                  </div>
                );
              })}
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="disableSavedFilters"
                  id="disableSavedFilters"
                  // defaultChecked={true}
                  onClick={handleClearFilters}
                />
                <Label
                  htmlFor="disableSavedFilters"
                  className="first-letter:uppercase"
                >
                  Отключить фильтры
                </Label>
              </div>
            </RadioGroup>
          </HoverCardComponent>
        )}
      </div>
    </>
  );
};

export default FiltersManagment;
