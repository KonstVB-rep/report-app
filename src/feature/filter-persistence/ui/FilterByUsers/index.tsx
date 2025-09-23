"use client";

import React, { memo } from "react";

import FilterPopover from "../FilterPopover";

type Props = {
  label: string;
  columnId?: string;
  managers: Record<string, string> | { id: string; label: string }[];
};

const FilterByUser = ({ label, columnId = "user", managers }: Props) => {
  return <FilterPopover columnId={columnId} options={managers} label={label} />;
};

export default memo(FilterByUser);
