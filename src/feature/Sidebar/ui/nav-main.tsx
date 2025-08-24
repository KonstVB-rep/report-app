import { ReactNode } from "react";

import { SidebarGroup, SidebarMenu } from "@/shared/components/ui/sidebar";

export function NavMain({ children }: { children: ReactNode }) {
  return (
    <SidebarGroup className="grid h-full grid-rows-[1fr_auto] gap-4">
      <SidebarMenu>{children}</SidebarMenu>
    </SidebarGroup>
  );
}
