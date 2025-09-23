"use client";

import { Table } from "@tanstack/react-table";

import dynamic from "next/dynamic";

import { DealBase } from "@/entities/deal/types";
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders";

const Filters = dynamic(() => import("./Filters"), {
  ssr: false,
  loading: () => <LoaderCircle />,
});

const DealsFilters = ({
  table,
  open,
}: {
  table: Table<DealBase>;
  open: boolean;
}) => {
  return (
    <>
      {open && (
        <div
          className={`grid overflow-hidden transition-all duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <Filters table={table} />
        </div>
      )}
    </>
  );
};

export default DealsFilters;
