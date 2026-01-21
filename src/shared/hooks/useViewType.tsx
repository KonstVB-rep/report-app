"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function isValidEnumValue<T extends string>(
  value: string | null,
  allowedValues: readonly T[],
): value is T {
  return value !== null && (allowedValues as readonly string[]).includes(value);
}

const useViewType = <T extends string>(
  defaultValue: T,
  allowedValues: readonly T[],
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlViewType = searchParams.get("viewType");
  const currentView = isValidEnumValue(urlViewType, allowedValues)
    ? urlViewType
    : defaultValue;

  const handleViewChange = useCallback(
    (value: T) => {
      if (value === currentView) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("viewType", value);

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [currentView, pathname, router, searchParams],
  );

  return {
    handleViewChange,
    currentView,
  };
};

export default useViewType;
