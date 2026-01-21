"use client"

import { useEffect, useMemo } from "react"
import { DepartmentEnum } from "@prisma/client"
import { BadgeRussianRuble, ChartNoAxesCombined, Wrench } from "lucide-react"
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import type { DepartmentInfo, DepartmentListItemType } from "@/entities/department/types"
import type { UserResponse } from "@/entities/user/types"
import { Skeleton } from "@/shared/components/ui/skeleton"
import DepartmentPersonsList from "./DepartmentPersonsList"

const icons: Record<DepartmentEnum, React.ReactNode> = {
  [DepartmentEnum.SALES]: <BadgeRussianRuble />,
  [DepartmentEnum.TECHNICAL]: <Wrench />,
  [DepartmentEnum.MARKETING]: <ChartNoAxesCombined />,
}

const getUrlPath = (depsId: number): Record<DepartmentEnum, string> => ({
  [DepartmentEnum.SALES]: `/dashboard/table/${depsId}`,
  [DepartmentEnum.TECHNICAL]: "",
  [DepartmentEnum.MARKETING]: `/dashboard/statistics/request-source`,
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
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton className="h-10 w-full" key={`placeholder-${i}`} />
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
