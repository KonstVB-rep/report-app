"use client"

import Link from "next/link"
import { useTaskCount } from "../api/hooks/useTaskCount"

interface TasksLinkProps {
  departmentId: string
  userId: string
}

export function TasksLink({ departmentId, userId }: TasksLinkProps) {
  const { data: count = 0 } = useTaskCount(userId)

  return (
    <Link
      className="btn_hover text-sm font-medium flex items-center gap-2"
      href={`/dashboard/tasks/${departmentId}/${userId}`}
      prefetch={false}
    >
      Мои задачи
      {count > 0 && (
        <span className="rounded-full bg-red-500 text-white text-xs px-2 py-0.5 border border-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
