import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/provider/query-provider";
import {
  getProjectsUserQuery,
  getRetailsUserQuery,
} from "@/entities/deal/api/queryFn";

import PersonTableProject from "../ui/PersonTableProject";
import PersonTableRetail from "../ui/PersonTableRetails";

const PersonTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; userId: string }>;
}) => {
  const { dealType, userId } = await params;

  const queryClient = getQueryClient();

  switch (dealType) {
    case "projects":
      await queryClient.prefetchQuery({
        queryKey: ["projects", userId],
        queryFn: () => {
          try {
            return getProjectsUserQuery(userId);
          } catch (error) {
            console.log(error, "ErrorPersonTablePage");
            throw error;
          }
        },
      });
      break;
    case "retails":
      await queryClient.prefetchQuery({
        queryKey: ["retails", userId],
        queryFn: () => {
          try {
            return getRetailsUserQuery(userId);
          } catch (error) {
            console.log(error, "ErrorPersonTablePage");
            throw error;
          }
        },
      });
      break;
    default:
      return null;
  }

  switch (dealType) {
    case "projects":
      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PersonTableProject userId={userId} />
        </HydrationBoundary>
      );
    case "retails":
      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PersonTableRetail userId={userId} />
        </HydrationBoundary>
      );
    default:
      return null;
  }
};

export default PersonTablePage;
