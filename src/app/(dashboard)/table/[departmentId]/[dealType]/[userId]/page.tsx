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

import PersonTableProject from "../ui/PersonTableProject";
import PersonTableRetail from "../ui/PersonTableRetails";
import PersonTableContract from "../ui/PersonTableContract";

const fetchData = async (
  queryClient: QueryClient,
  dealType: string,
  userId: string
) => {
  switch (dealType) {
    case "projects":
      return queryClient.prefetchQuery({
        queryKey: ["projects", userId],
        queryFn: () => getProjectsUserQuery(userId),
      });
    case "retails":
      return queryClient.prefetchQuery({
        queryKey: ["retails", userId],
        queryFn: () => getRetailsUserQuery(userId),
      });
    case "contracts":
      return queryClient.prefetchQuery({
        queryKey: ["contracts", userId],
        queryFn: () => getContractsUserQuery(userId),
    });
    default:
      return null;
  }
};

const PersonTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string }>;
}) => {
  const { dealType, userId } = await params;
  const queryClient = getQueryClient();

  try {
    await fetchData(queryClient, dealType, userId);
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
