"use client";

import { DepartmentListItemType } from "@/entities/department/types";
import { SidebarGroup, SidebarMenu } from "@/shared/components/ui/sidebar";

import DepartmentPersonsList from "./DepartmentPersonsList";

export function NavMain({ items }: { items: DepartmentListItemType[] }) {
  return (
    <SidebarGroup className="grid h-full grid-rows-[1fr_auto] gap-4">
      <SidebarMenu>
        {items.map((item) => (
          <DepartmentPersonsList key={item.id} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
