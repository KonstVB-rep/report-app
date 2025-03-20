import { getAllUsersFromFilter } from "@/entities/user/api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/entities/user/ui/Toast";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const RenderFilterPopover = React.memo(({
  renderFilter,
}: {
  renderFilter: (
    data: Record<string, string> | { id: string; label: string }[]
  ) => React.ReactNode;
}) => {
  const { authUser } = useStoreUser();

  console.log(authUser, "authUser")

  const { data: usersDepartment, isPending: isPendingUsersDepartment } =
    useQuery({
      queryKey: ["users", authUser?.departmentId],
      queryFn: async () => {
        try {
          
          const users = await getAllUsersFromFilter(authUser!.departmentId);

          return users;
        } catch (error) {
          console.log(error);
          TOAST.ERROR("Произошла ошибка при получении пользователей");
          throw error;
        }
      },
      enabled: !!authUser?.departmentId,
    });

  console.log(isPendingUsersDepartment, usersDepartment);

  return (
    <div className="max-w-fit">
      {isPendingUsersDepartment && (
        <div className="w-32 h-9 bg-muted animate-pulse rounded-md" />
      )}
      {usersDepartment && renderFilter(usersDepartment)}
    </div>
  );
});

RenderFilterPopover.displayName = "RenderFilterPopover";

export default RenderFilterPopover;
