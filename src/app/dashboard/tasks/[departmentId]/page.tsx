"use client";

import { PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { useGetTasksDepartment } from "@/entities/task/hooks/query";
import useViewType from "@/entities/task/hooks/useViewType";
import { viewType } from "@/entities/task/model/constants";
import LoadingView from "@/entities/task/ui/LoadingView";
import СreateTaskDialog from "@/entities/task/ui/Modals/СreateTaskDialog";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath";

const Kanban = dynamic(() => import("@/entities/task/ui/Kanban"), {
  ssr: false,
  loading: () => <LoadingView />,
});

const TaskTable = dynamic(() => import("@/entities/task/ui/TaskTable"), {
  ssr: false,
  loading: () => <LoadingView />,
});

const TasksPage = () => {
  const { authUser } = useStoreUser();

  const hasAccess = hasAccessToDataSummary(
    authUser?.id as string,
    PermissionEnum.TASK_MANAGEMENT
  );

  const { departmentId } = useParams<{
    departmentId: string;
  }>();

  const { data, isPending } = useGetTasksDepartment();

  console.log(isPending, "isPending");

  const { handleViewChange, currentView } = useViewType();

  if (!authUser) return null;

  if (!hasAccess) {
    return (
      <RedirectToPath to={`/dashboard/tasks/${departmentId}/${authUser.id}`} />
    );
  }

  if (isPending) {
    return <LoaderCircleInWater />;
  }

  return (
    <section className="p-5">
      <h1 className="text-xl py-2">Все задачи</h1>

      <Separator />

      <div className="p-2 flex flex-wrap-reverse justify-between gap-2">
        <div className="flex gap-2">
          {viewType.map((item) => {
            return (
              <Button
                key={item.id}
                variant="outline"
                onClick={() => handleViewChange(item.id)}
              >
                {item.value}
              </Button>
            );
          })}
        </div>

        <СreateTaskDialog />
      </div>

      <MotionDivY>
        {currentView === "table" && data && <TaskTable data={data} />}

        {currentView === "kanban" && data && <Kanban data={data} />}
      </MotionDivY>
    </section>
  );
};

export default TasksPage;
