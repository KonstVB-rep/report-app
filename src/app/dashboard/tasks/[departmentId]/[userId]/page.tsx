"use client";

import { PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import LoadingView from "@/entities/task/ui/LoadingView";
import useStoreUser from "@/entities/user/store/useStoreUser";
import CalendarBotLink from "@/feature/calendar/ui/CalendarBotLink";
import { useGetUserTasks } from "@/feature/task/hooks/query";
import useViewType from "@/feature/task/hooks/useViewType";
import { viewType } from "@/feature/task/model/constants";
import СreateTaskDialog from "@/feature/task/ui/Modals/СreateTaskDialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import RedirectToPath from "@/shared/custom-components/ui/Redirect/RedirectToPath";

const Kanban = dynamic(() => import("@/widgets/task/ui/Kanban"), {
  ssr: false,
  loading: () => <LoadingView />,
});

const TaskTable = dynamic(() => import("@/widgets/task/ui/TaskTable"), {
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
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl py-2 uppercase">Мои задачи</h1>
        <CalendarBotLink botName="ertel_report_app_task_bot" />
      </div>

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
