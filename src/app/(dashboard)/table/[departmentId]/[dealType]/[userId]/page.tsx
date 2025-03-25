import {
  getRetailsUserQuery,
  getProjectsUserQuery,
} from "@/entities/deal/api/queryFn";
import PersonTableProject from "../ui/PersonTableProject";
import PersonTableRetail from "../ui/PersonTableRetails";
import { getQueryClient } from "@/app/provider/query-provider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
        queryFn: () => getProjectsUserQuery(userId),
      }); // Запрос данных для проектов
      break;
    case "retails":
      await queryClient.prefetchQuery({
        queryKey: ["retails", userId],
        queryFn: () => getRetailsUserQuery(userId),
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
