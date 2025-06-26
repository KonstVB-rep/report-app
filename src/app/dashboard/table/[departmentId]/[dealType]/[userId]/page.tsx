import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getQueryClient } from "@/app/provider/query-provider";
import {
  getContractsUserQuery,
  getProjectsUserQuery,
  getRetailsUserQuery,
} from "@/entities/deal/api/queryFn";

// import OrdersTable from "../../../../../../entities/order/ui/OrdersTable";
import PersonTableContract from "../ui/PersonTableContract";
import PersonTableProject from "../ui/PersonTableProject";
import PersonTableRetail from "../ui/PersonTableRetails";

// import { getAllOrder } from "@/entities/order/api";

const DealsInWork = ["projects", "retails", "contracts"];

const fetchData = async (
  queryClient: QueryClient,
  dealType: string,
  id: string
) => {
  switch (dealType) {
    case "projects":
      return queryClient.prefetchQuery({
        queryKey: ["projects", id],
        queryFn: () => getProjectsUserQuery(id),
      });
    case "retails":
      return queryClient.prefetchQuery({
        queryKey: ["retails", id],
        queryFn: () => getRetailsUserQuery(id),
      });
    case "contracts":
      return queryClient.prefetchQuery({
        queryKey: ["contracts", id],
        queryFn: () => getContractsUserQuery(id),
      });
    // case "orders":
    //   return queryClient.prefetchQuery({
    //     queryKey: ["orders", id],
    //     queryFn: () => getAllOrder(id),
    // });
    default:
      return null;
  }
};

const PersonTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string; departmentId: string }>;
}) => {
  const { dealType, userId, departmentId } = await params;
  const queryClient = getQueryClient();
  try {
    const id = DealsInWork.includes(dealType) ? userId : departmentId;

    await fetchData(queryClient, dealType, id);
  } catch (error) {
    console.log(error, "ErrorPersonTablePage");
    throw new Error((error as Error).message);
  }

  let Component;
  switch (dealType) {
    case "projects":
      Component = PersonTableProject;
      break;
    case "retails":
      Component = PersonTableRetail;
      break;
    case "contracts":
      Component = PersonTableContract;
      break;
    // case "orders":
    //   Component = OrdersTable;
    //   break;
    default:
      return null;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Component userId={userId} />
    </HydrationBoundary>
  );
};

export default PersonTablePage;
