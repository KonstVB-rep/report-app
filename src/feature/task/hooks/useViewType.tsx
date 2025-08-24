"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { ViewType } from "../types";

const useViewType = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultView: ViewType = (searchParams.get("viewType") ||
    "table") as ViewType;

  const [currentView, setCurrentView] = useState<ViewType>(
    defaultView as ViewType
  );

  const handleViewChange = (value: ViewType) => {
    if (value === currentView) return;
    setCurrentView(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("viewType", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewType", defaultView);
    setCurrentView(defaultView);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [defaultView, router, searchParams]);

  return {
    handleViewChange,
    currentView,
  };
};

export default useViewType;
