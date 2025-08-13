// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";

// import { getQueryClient } from "@/app/provider/query-provider";
// import { getAllOrder } from "@/entities/order/api";
// import OrdersTable from "@/entities/order/ui/OrdersTable";

// const fetchData = async (queryClient: QueryClient, id: string) => {
//   return queryClient.prefetchQuery({
//     queryKey: ["orders", id],
//     queryFn: () => getAllOrder(id),
//   });
// };

// const OrderTablePage = async ({
//   params,
// }: {
//   params: Promise<{ departmentId: string }>;
// }) => {
//   const { departmentId } = await params;
//   const queryClient = getQueryClient();
//   try {
//     await fetchData(queryClient, departmentId);
//   } catch (error) {
//     console.log(error, "ErrorPersonTablePage");
//     throw new Error((error as Error).message);
//   }

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <OrdersTable />
//     </HydrationBoundary>
//   );
// };

// export default OrderTablePage;
