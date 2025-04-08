"use client";

import { Button } from "@/components/ui/button";
import HoverCardComponent from "@/shared/ui/HoverCard";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import { ListFilterPlus, Settings2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import SaveFilter from "./SaveFilter";
import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import UserFiltersChange from "./UserFiltersChange";
import { UserFilter } from "@prisma/client";
import { useGetUserFilters } from "../hooks/query";
import { useDisableSavedFilters, useSelectFilter } from "../hooks/mutate";

type FiltersManagmentContentProps = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: Dispatch<React.SetStateAction<VisibilityState>>;
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
};

const FiltersManagmentContent = ({
  setColumnFilters,
  setColumnVisibility,
  columnFilters,
  columnVisibility,
  setSelectedColumns,
}: FiltersManagmentContentProps) => {
  const { data: userFilters = [] } = useGetUserFilters();
  const { mutate: disableSavedFilters, isPending } = useDisableSavedFilters()
  const { mutate: selectFilter, isPending: isPendingSelect } = useSelectFilter();

  const progressRequest = isPending || isPendingSelect

  const searchParams = useSearchParams();

  const [selectedFilterName, setSelectedFilterName] = useState<string>("");

  const defaultCheckedFilter = userFilters.find((item) => item.isActive);

  const handleClearFilters = () => {

    setColumnFilters([]);
    setColumnVisibility({});
    setSelectedFilterName("");
    disableSavedFilters()
  };

  const filterSelect = useCallback(
    (filter: UserFilter) => {

      const { filterName, filterValue } = filter;
      if (!filterValue) return;

      if (selectedFilterName === filterName) return;
      setSelectedFilterName(filterName);

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
      selectFilter(filter.id);
    },
    [selectFilter, selectedFilterName, setColumnFilters, setColumnVisibility]
  );

  useEffect(() => {
    if (defaultCheckedFilter) {
      filterSelect(defaultCheckedFilter);
    }
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        {searchParams.size > 0 && (
          <HoverCardComponent
            title={<Settings2 />}
            className="border-stone-solid-600 flex gap-1 items-center"
          >
            {columnFilters.length || Object.keys(columnVisibility).length ? (
              <SaveFilter />
            ) : null}
            <TooltipComponent content="Сбросить фильтры">
              <Button
                variant={"destructive"}
                size={"icon"}
                className="btn_hover w-fit"
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
        {userFilters.length > 0 && (
          <HoverCardComponent
            sideOffset={4}
            align="end"
            title={<ListFilterPlus />}
            className="stoneborder-stone-solid-600"
          >
            <RadioGroup
              defaultValue={
                defaultCheckedFilter?.filterName || "disableSavedFilters"
              }
              className="grid gap-1 p-2"
            >
              {userFilters.map((filter) => {
                return (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between space-x-2"
                  >
                    <div className="flex items-center gap-2 btn_hover w-full">
                      <RadioGroupItem
                        value={filter.filterName}
                        id={filter.id}
                        onClick={() => filterSelect(filter)}
                        className="active:scale-90 duration-150 transition-transform"
                        disabled={progressRequest}
                      />
                      <Label
                        htmlFor={filter.id}
                        className="max-w-36 w-full h-full cursor-pointer truncate first-letter:uppercase"
                      >
                        {filter.filterName}
                      </Label>
                    </div>
                    <UserFiltersChange filterId={filter.id} />
                  </div>
                );
              })}
              <div className="flex h-9 items-center space-x-2 py-2 btn_hover w-full">
                <RadioGroupItem
                  value="disableSavedFilters"
                  id="disableSavedFilters"
                  onClick={handleClearFilters}
                  className="active:scale-90 duration-150 transition-transform"
                  disabled={progressRequest}
                />
                <Label
                  htmlFor="disableSavedFilters"
                  className="cursor-pointer first-letter:uppercase"
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

export default FiltersManagmentContent;
