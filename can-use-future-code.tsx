// //dashboard/template.tsx - закомментированный код
// /**
//  *
//  * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<для входящих звявок
//  */

// "use client";

// import { PropsWithChildren } from "react";

// import dynamic from "next/dynamic";
// import { usePathname } from "next/navigation";

// import { useGetDepartmentsWithUsers } from "@/entities/department/hooks";
// // import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
// import useStoreUser from "@/entities/user/store/useStoreUser";
// import AppSidebar from "@/feature/Sidebar/ui/app-sidebar";
// import { SiteHeader } from "@/feature/Sidebar/ui/site-header";
// import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
// import PageTransitionY from "@/shared/custom-components/ui/MotionComponents/PageTransitionY";

// const RedirectToPath = dynamic(
//   () => import("@/shared/custom-components/ui/Redirect/RedirectToPath"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="h-full w-full min-h-screen grid place-items-center bg-transparent">
//         <p className="text-2xl sm:text-4xl opacity-30">
//           Идет завершение сессии...
//         </p>
//       </div>
//     ),
//   }
// );

// const TemplateDashboard = ({ children }: PropsWithChildren) => {
//   const pathname = usePathname();
//   const { authUser } = useStoreUser();
//   // const { setDepartments } = useStoreDepartment();

//   // const { data: ordersNotInProgress, refetch } =
//   //   useGetOrdersNotAtWorkByUserId();

//   useGetDepartmentsWithUsers();

//   // const [isModalOpen, setIsModalOpen] = useState(false);
//   // const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
//   //   null
//   // );

//   // useEffect(() => {
//   //   if (authUser && departmentData) {
//   //     setDepartments(departmentData);
//   //   }
//   // }, [authUser, departmentData, setDepartments]);

//   // логика оповещений о заявках
//   // useEffect(() => {
//   //   if (ordersNotInProgress && ordersNotInProgress.length > 0) {
//   //     ordersNotInProgress.forEach((order) => {
//   //       toast(`Новая заявка: ${order.nameDeal} Контакт: ${order.nameDeal}`, {
//   //         style: {
//   //           background: "hsl(var(--background))",
//   //           borderColor: "hsl(var(--muted-foreground))",
//   //           color: "hsl(var(--foreground))",
//   //         },
//   //         position: "bottom-right",
//   //         duration: Infinity,
//   //         action: {
//   //           label: "Принять в работу",
//   //           onClick: () => {
//   //             setSelectedOrder(order);
//   //             setIsModalOpen(true);
//   //           },
//   //         },
//   //       });
//   //     });
//   //   }
//   // }, [ordersNotInProgress]);

//   // const handleClose = (value: boolean) => {
//   //   setIsModalOpen(value);
//   //   if (!value) {
//   //     refetch();
//   //   }
//   // };

//   if (!authUser) {
//     return <RedirectToPath to="/login" />;
//   }

//   return (
//     <>
//       <div className="min-w-64 [--header-height:calc(theme(spacing.14))]">
//         <SidebarProvider className="flex flex-col">
//           <SiteHeader />
//           <div className="flex min-h-[calc(100svh-var(--header-height)-2px)] max-h-[calc(100svh-var(--header-height)-2px)] flex-1">
//             <AppSidebar />
//             <SidebarInset className="h-auto min-h-min" key={pathname}>
//               <PageTransitionY>{children}</PageTransitionY>
//             </SidebarInset>
//           </div>
//         </SidebarProvider>
//       </div>
//       {/* {isModalOpen &&
//         createPortal(
//           <TabsDealTypeForms
//             order={selectedOrder}
//             isModalOpen={isModalOpen}
//             setIsModalOpen={handleClose}
//           />,
//           document.body
//         )} */}
//     </>
//   );
// };

// export default TemplateDashboard;

//   // import {
// //   dehydrate,
// //   HydrationBoundary,
// //   QueryClient,
// // } from "@tanstack/react-query";

// // import { getQueryClient } from "@/app/provider/query-provider";
// // import { getAllOrder } from "@/entities/order/api";
// // import OrdersTable from "@/entities/order/ui/OrdersTable";

// // const fetchData = async (queryClient: QueryClient, id: string) => {
// //   return queryClient.prefetchQuery({
// //     queryKey: ["orders", id],
// //     queryFn: () => getAllOrder(id),
// //   });
// // };

// // const OrderTablePage = async ({
// //   params,
// // }: {
// //   params: Promise<{ departmentId: string }>;
// // }) => {
// //   const { departmentId } = await params;
// //   const queryClient = getQueryClient();
// //   try {
// //     await fetchData(queryClient, departmentId);
// //   } catch (error) {
// //     console.log(error, "ErrorPersonTablePage");
// //     throw new Error((error as Error).message);
// //   }

// //   return (
// //     <HydrationBoundary state={dehydrate(queryClient)}>
// //       <OrdersTable />
// //     </HydrationBoundary>
// //   );
// // };

// // export default OrderTablePage;

// //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// //eventsHandlers.ts<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// // export const IsExistIntersectionEvents = (
// //   newEventStart: Date,
// //   newEventEnd: Date,
// //   events: EventInputType[] | undefined,
// //   editingId: string | null
// // ) => {
// //   const overlap = events
// //     ?.filter((item) => item.id !== editingId)
// //     ?.some((event) => {
// //       // Преобразуем время начала и конца события в Date, чтобы избежать проблем с временем в разных часовых поясах
// //       const eventStart = new Date(event.start);
// //       const eventEnd = new Date(event.end);

// //       // Проверка, пересекается ли новое событие с существующим
// //       return (
// //         (newEventStart >= eventStart && newEventStart < eventEnd) || // Если начало нового события попадает в существующее
// //         (newEventEnd > eventStart && newEventEnd <= eventEnd) || // Если конец нового события попадает в существующее
// //         (newEventStart <= eventStart && newEventEnd >= eventEnd) // Если новое событие полностью охватывает существующее
// //       );
// //     });

// //   if (overlap) {
// //     // Если события пересекаются, установим предупреждение
// //     TOAST.ERROR(
// //       "У вас yже есть событие на выбранное время!Удалите или измените время одного из событий."
// //     );
// //     return true;
// //   }
// //   return false;
// // };

// //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
