"use client";

import { PropsWithChildren, useEffect } from "react";

import dynamic from "next/dynamic";
// import { createPortal } from "react-dom";

import { usePathname } from "next/navigation";

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
// import { useGetOrdersNotAtWorkByUserId } from "@/entities/order/hooks/query";
// import { OrderResponse } from "@/entities/order/types";
// import TabsDealTypeForms from "@/entities/order/ui/TabsDealTypeForms";
import useStoreUser from "@/entities/user/store/useStoreUser";
import AppSidebar from "@/feature/Sidebar/ui/app-sidebar";
import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
// import { toast } from "sonner";

import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY";

const RedirectToPath = dynamic(
  () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full min-h-screen grid place-items-center bg-transparent">
        <p className="text-2xl sm:text-4xl opacity-30">
          Идет завершение сессии...
        </p>
      </div>
    ),
  }
);

const TemplateDashboard = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const { authUser } = useStoreUser();
  const { setDepartments } = useStoreDepartment();

  // const { data: ordersNotInProgress, refetch } =
  //   useGetOrdersNotAtWorkByUserId();

  const { data: departmentData } = useGetDepartmentsWithUsers();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
  //   null
  // );

  useEffect(() => {
    if (authUser && departmentData) {
      setDepartments(departmentData);
    }
  }, [authUser, departmentData, setDepartments]);

  // логика оповещений о заявках
  // useEffect(() => {
  //   if (ordersNotInProgress && ordersNotInProgress.length > 0) {
  //     ordersNotInProgress.forEach((order) => {
  //       toast(`Новая заявка: ${order.nameDeal} Контакт: ${order.nameDeal}`, {
  //         style: {
  //           background: "hsl(var(--background))",
  //           borderColor: "hsl(var(--muted-foreground))",
  //           color: "hsl(var(--foreground))",
  //         },
  //         position: "bottom-right",
  //         duration: Infinity,
  //         action: {
  //           label: "Принять в работу",
  //           onClick: () => {
  //             setSelectedOrder(order);
  //             setIsModalOpen(true);
  //           },
  //         },
  //       });
  //     });
  //   }
  // }, [ordersNotInProgress]);

  // const handleClose = (value: boolean) => {
  //   setIsModalOpen(value);
  //   if (!value) {
  //     refetch();
  //   }
  // };

  if (!authUser) {
    return <RedirectToPath to="/login" />;
  }

  return (
    <>
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
      {/* {isModalOpen &&
        createPortal(
          <TabsDealTypeForms
            order={selectedOrder}
            isModalOpen={isModalOpen}
            setIsModalOpen={handleClose}
          />,
          document.body
        )} */}
    </>
  );
};

export default TemplateDashboard;
