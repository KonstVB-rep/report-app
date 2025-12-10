"use client"

import { useGetDepartmentsWithUsers } from "@/entities/department/hooks"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import type {
  DepartmentInfo,
  DepartmentListItemType,
  UnionTypeDepartmentsName,
} from "@/entities/department/types"
import type { UserResponse } from "@/entities/user/types"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { BadgeRussianRuble, ChartNoAxesCombined, Wrench } from "lucide-react"
import { useEffect, useMemo } from "react"
import { v4 as uuid } from "uuid"
import DepartmentPersonsList from "./DepartmentPersonsList"

// Вынесли объекты наружу, чтобы они не пересоздавались
const icons = {
  SALES: <BadgeRussianRuble />,
  TECHNICAL: <Wrench />,
  MARKETING: <ChartNoAxesCombined />,
}

const getUrlPath = (depsId: number): Record<UnionTypeDepartmentsName, string> => ({
  SALES: `/dashboard/table/${depsId}`,
  TECHNICAL: "",
  MARKETING: `/dashboard/statistics/request-source`,
})

const DepartmentListWrapper = () => {
  const { setDepartments } = useStoreDepartment()
  const { data: departmentData, isLoading, isError } = useGetDepartmentsWithUsers()

  useEffect(() => {
    if (departmentData) {
      setDepartments(departmentData)
    }
  }, [departmentData, setDepartments])

  const navMainItems = useMemo(() => {
    if (!departmentData || !departmentData.length) {
      return []
    }
    return (departmentData as DepartmentInfo[]).map((dept) => ({
      id: dept.id,
      title: dept.name,
      icon: icons[dept.name],
      url: `/dashboard/department/${dept.id}`,
      directorId: dept.directorId,
      items: dept.users.map((person: Omit<UserResponse, "email" | "role">) => ({
        id: person.id,
        departmentId: person.departmentId,
        username: person.username,
        position: person.position,
        url: getUrlPath(person.departmentId)[dept.name],
      })),
    })) as DepartmentListItemType[]
  }, [departmentData])

  if (isLoading) {
    return (
      <div className="top-0 h-[calc(100svh-var(--header-height))]! min-w-60 shrink-0 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2">
        {Array.from({ length: 3 }, () => (
          <Skeleton className="h-10 w-full" key={uuid()} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-2">
        <p className="text-sm text-destructive p-2 border border-red-400 rounded-md">
          Ошибка загрузки отделов
        </p>
      </div>
    )
  }

  if (!navMainItems.length) {
    return (
      <div className="p-2">
        <p className="text-sm text-muted-foreground">Нет отделов</p>
      </div>
    )
  }

  return (
    <>
      {navMainItems.map((item) => (
        <DepartmentPersonsList item={item} key={item.id} />
      ))}
    </>
  )
}

export default DepartmentListWrapper
