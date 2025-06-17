'use client'

import { hasAccessToData } from '@/entities/deal/lib/hasAccessToData'
import { useGetTask } from '@/entities/task/hooks/query'
// import TaskCard from '@/entities/task/ui/TaskCard'
import useStoreUser from '@/entities/user/store/useStoreUser'
import RedirectToPath from '@/shared/ui/Redirect/RedirectToPath'
import { PermissionEnum } from '@prisma/client'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'
import Loading from './loading'

const TaskCard = dynamic(() => import("@/entities/task/ui/TaskCard"))

const TaskPage = () => {
   const {authUser} =  useStoreUser()
   const {taskId} = useParams()

  const {userId, departmentId} = useParams();

  const{data, isPending} = useGetTask(taskId as string)

  const hasAccess = useMemo(
      () =>
        userId
          ? hasAccessToData(
              userId as string,
              PermissionEnum.TASK_MANAGEMENT
            )
          : false,
      [userId]
  );


  if (!hasAccess)
  return (
    <RedirectToPath
      to={`/tasks/${departmentId as string}/${authUser?.id}`}
    />
  );

  if (isPending) {
    return <Loading />;
  }

  if (!data) {
    return (
      <h1 className='p-5 pt-20 text-2xl text-center'>
        Задача не найдена
      </h1>
    );
  }

  return (
    <div className='p-5'>
      <TaskCard task={data} />
    </div>
  );

}

export default TaskPage