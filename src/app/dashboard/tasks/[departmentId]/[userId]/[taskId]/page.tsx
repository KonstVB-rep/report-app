"use client";

import { PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import { useGetTask } from "@/entities/task/hooks/query";
// import TaskCard from '@/entities/task/ui/TaskCard'
import useStoreUser from "@/entities/user/store/useStoreUser";
import RedirectToPath from "@/shared/ui/Redirect/RedirectToPath";

import Loading from "./loading";

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"),{
  loading: () => <Loading />,
  ssr: false, 
});

const TaskPage = () => {
  const { authUser } = useStoreUser();

   const { taskId, userId, departmentId } = useParams<{
    taskId: string;
    userId: string;
    departmentId: string;
  }>();

  const { data, isPending } = useGetTask(taskId);

  const hasAccess = hasAccessToData(userId, PermissionEnum.TASK_MANAGEMENT);

   if (!hasAccess) {
    return <RedirectToPath to={`/tasks/${departmentId}/${authUser?.id}`} />;
  }

  if (isPending) return <Loading />;
  if (!data) return <h1 className="p-5 pt-20 text-2xl text-center">Задача не найдена</h1>;

  return (
    <div className="p-5">
      <TaskCard task={data} />
    </div>
  );
};

export default TaskPage;
