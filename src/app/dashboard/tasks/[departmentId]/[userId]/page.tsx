"use client";

import { PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import { useGetUserTasks } from "@/entities/task/hooks/query";
import useViewType from "@/entities/task/hooks/useViewType";
import { viewType } from "@/entities/task/model/constants";
import LoadingView from "@/entities/task/ui/LoadingView";
import СreateTaskDialog from "@/entities/task/ui/Modals/СreateTaskDialog";
import useStoreUser from "@/entities/user/store/useStoreUser";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import RedirectToPath from "@/shared/ui/Redirect/RedirectToPath";

const Kanban = dynamic(() => import("@/entities/task/ui/Kanban"), {
  ssr: false,
  loading: () => <LoadingView />,
});

const TaskTable = dynamic(() => import("@/entities/task/ui/TaskTable"), {
  ssr: false,
  loading: () => <LoadingView />,
});

const UserTasksPage = () => {
  const { authUser } = useStoreUser();

  const { userId, departmentId } = useParams<{
    userId: string;
    departmentId: string;
  }>();

  const hasAccess = hasAccessToData(userId, PermissionEnum.TASK_MANAGEMENT);

  const { data } = useGetUserTasks();

  const { handleViewChange, currentView } = useViewType();

  if (!authUser) return;

  if (!hasAccess)
    return (
      <RedirectToPath to={`/tasks/${departmentId as string}/${authUser.id}`} />
    );

  return (
    <section className="p-5">
      <h1 className="text-xl py-2">Мои задачи</h1>

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

export default UserTasksPage;
