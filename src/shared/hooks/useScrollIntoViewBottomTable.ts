import { useReactTable } from "@tanstack/react-table";

import { useEffect, useRef } from "react";

const useScrollIntoViewBottom = <T, E extends HTMLElement = HTMLDivElement>(
  dep: ReturnType<typeof useReactTable<T>>
) => {
  const ref = useRef<E>(null);

  const filterLength = dep?.getState().columnFilters?.length ?? 0;
  const columnHiddenLength = Object.values(
    dep?.getState().columnFilters ?? {}
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

export default useScrollIntoViewBottom;
