import { useReactTable } from "@tanstack/react-table";

import { useEffect, useRef } from "react";

const useScrollIntoViewBottomTable = <T>(
  dep: ReturnType<typeof useReactTable<T>>
) => {
  const ref = useRef<HTMLElement>(null);

  const filterLength = dep?.getState().columnFilters.length;
  const columnHiddenLength = Object.values(
    dep?.getState().columnFilters
  ).length;

  useEffect(() => {
    if (!ref.current) return;

    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, 100);
  }, [dep, filterLength, columnHiddenLength]);

  return ref;
};

export default useScrollIntoViewBottomTable;
