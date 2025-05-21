"use client";

import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const FiltersManagmentContent = dynamic(
  () => import("./FiltersManagmentContent"),
  { ssr: false }
);

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
        {columnFilters.length > 0 && (
          <div className="flex h-8 w-8 items-center justify-center gap-2 rounded-md border border-solid border-blue-600 bg-muted p-1">
            {columnFilters.length}
          </div>
        )}
      </div>
      {columnFilters.length > 0 && (
        <FiltersManagmentContent
          setColumnFilters={setColumnFilters}
          setColumnVisibility={setColumnVisibility}
          columnFilters={columnFilters}
          columnVisibility={columnVisibility}
          setSelectedColumns={setSelectedColumns}
        />
      )}
    </>
  );
};

export default FiltersManagment;
