"use client";

import { PropsWithChildren, useEffect } from "react";

import { usePathname } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/feature/Sidebar/ui/app-sidebar";
import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
import PageTransitionY from "@/shared/ui/MotionComponents/PageTransitionY";
import { useGetOrdersNotAtWorkByUserId } from "@/entities/order/hooks/query";
import { toast } from "sonner";
import { useUpdateOrderStatusAtWork } from "@/entities/order/hooks/mutate";

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const {data: ordersNotInProgress } = useGetOrdersNotAtWorkByUserId();

  const {mutate: updateAtWorkStatusOrder} = useUpdateOrderStatusAtWork()

  console.log(ordersNotInProgress, 'ordersNotInProgress')

  useEffect(() => {
  if (ordersNotInProgress && ordersNotInProgress.length > 0) {
    ordersNotInProgress.forEach((order) => {
      toast(`Новая заявка: ${order.nameDeal}
        Контакт: ${order.nameDeal}
        `, {
        style: {
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--muted-foreground))",
          color: "hsl(var(--foreground))"
        },
        position: "bottom-right",
        duration: Infinity,
        action: {
          label: "Принять в работу",
          onClick: () => {
           updateAtWorkStatusOrder(order)
          },
        },
      });
    });
  }
}, [ordersNotInProgress]);

  return (
    <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex-1">
          <AppSidebar />
          <SidebarInset className="h-auto min-h-min" key={pathname}>
            <PageTransitionY>{children}</PageTransitionY>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TemplateDashboard;
