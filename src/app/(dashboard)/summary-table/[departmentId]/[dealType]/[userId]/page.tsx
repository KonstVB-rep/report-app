// import {
//   getAllProjectsByDepartmentQuery,
//   getAllRetailsByDepartmentQuery,
// } from "@/entities/deal/api/queryFn";
// import SummaryTableProject from "../ui/SummaryTableProject";
// import SummaryTableRetail from "../ui/SummaryTableRetail";
// import { getQueryClient } from "@/app/provider/query-provider";
// import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

// const SummaryTablePage = async ({
//   params,
// }: {
//   params: Promise<{ dealType: string; departmentId: string; userId: string }>;
// }) => {
//   const { dealType, departmentId } = await params;

//   const queryClient = getQueryClient();

//   // console.log(typeof departmentId, "departmentId");

//   switch (dealType) {
//     case "projects":
//       await queryClient.prefetchQuery({
//         queryKey: ["all-projects", departmentId],
//         queryFn: () => getAllProjectsByDepartmentQuery(departmentId),
//       }); // Запрос данных для проектов
//       break;
//     case "retails":
//       await queryClient.prefetchQuery({
//         queryKey: ["all-retails", departmentId],
//         queryFn: () => getAllRetailsByDepartmentQuery(departmentId),
//       });
//       break;
//     default:
//       return null;
//   }

//   switch (dealType) {
//     case "projects":
//       return (
//         <HydrationBoundary state={dehydrate(queryClient)}>
//           <SummaryTableProject />
//         </HydrationBoundary>
//       );
//     case "retails":
//       return (
//         <HydrationBoundary state={dehydrate(queryClient)}>
//           <SummaryTableRetail />
//         </HydrationBoundary>
//       );
//     default:
//       return null;
//   }
// };

// export default SummaryTablePage;
import {
  getAllProjectsByDepartmentQuery,
  getAllRetailsByDepartmentQuery,
} from "@/entities/deal/api/queryFn";
import SummaryTableProject from "../ui/SummaryTableProject";
import SummaryTableRetail from "../ui/SummaryTableRetail";
import { getQueryClient } from "@/app/provider/query-provider";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const SummaryTablePage = async ({
  params,
}: {
  params: Promise<{ dealType: string; departmentId: string; userId: string }>;
}) => {
  const { dealType, departmentId } = await params;

  const queryClient = getQueryClient();

  // Выполняем запросы для prefetch
  switch (dealType) {
    case "projects":
      await queryClient.prefetchQuery({
        queryKey: ["all-projects", +departmentId],
        queryFn: () => {
          try {
            return getAllProjectsByDepartmentQuery();
          } catch (error) {
            console.log(error);
            throw error;
          }
        },
      });
      break;
    case "retails":
      await queryClient.prefetchQuery({
        queryKey: ["all-retails", +departmentId],
        queryFn: () => {
          try {
            return getAllRetailsByDepartmentQuery();
          } catch (error) {
            console.log(error);
            throw error;
          }
        },
      });
      break;
    default:
      return null;
  }

  // Гидратация и передача данных через HydrationBoundary
  const dehydratedState = dehydrate(queryClient);

  switch (dealType) {
    case "projects":
      return (
        <HydrationBoundary state={dehydratedState}>
          <SummaryTableProject />
        </HydrationBoundary>
      );
    case "retails":
      return (
        <HydrationBoundary state={dehydratedState}>
          <SummaryTableRetail />
        </HydrationBoundary>
      );
    default:
      return null;
  }
};

export default SummaryTablePage;
