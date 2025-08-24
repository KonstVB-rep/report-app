import React from "react";

import { useSearchParams } from "next/navigation";

import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";

import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext";
import SaveFilter from "./SaveFilter";

type SaveOrDropFiltersType = {
  handleClearFilters: () => void;
};

const SaveOrDropFilters = ({ handleClearFilters }: SaveOrDropFiltersType) => {
  const searchParams = useSearchParams();
  const { columnFilters, columnVisibility, setSelectedColumns } =
    useDataTableFiltersContext();
  return (
    <>
      {searchParams.size > 0 && (
        <>
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
        </>
      )}
    </>
  );
};

export default SaveOrDropFilters;
