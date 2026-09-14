"use client"
import { useQuery } from "@tanstack/react-query"
import { getTaskCount } from "../task.actions"

export const useTaskCount = (userId: string) => {
  return useQuery({
    queryKey: ["taskCount", userId],
    queryFn: () => getTaskCount(userId),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  })
}
