import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import dynamic from "next/dynamic";

import { getQueryClient } from "@/app/provider/query-provider";
import {
  getContractsUserQuery,
  getProjectsUserQuery,
  getRetailsUserQuery,
} from "@/entities/deal/api/queryFn";

import Loading from "./loading";

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
      Component = dynamic(() => import("../ui/PersonTableProjects"), {
        loading: () => <Loading />,
      });
      break;
    case "retails":
      Component = dynamic(() => import("../ui/PersonTableRetails"), {
        loading: () => <Loading />,
      });
      break;
    case "contracts":
      Component = dynamic(() => import("../ui/PersonTableContracts"), {
        loading: () => <Loading />,
      });
      break;
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
