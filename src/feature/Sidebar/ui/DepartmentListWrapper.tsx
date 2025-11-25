import { useEffect, useMemo } from "react"
import { BadgeRussianRuble, ChartNoAxesCombined, Wrench } from "lucide-react"
import { useGetDepartmentsWithUsers } from "@/entities/department/hooks"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import type {
  DepartmentInfo,
  DepartmentListItemType,
  UnionTypeDepartmentsName,
} from "@/entities/department/types"
import type { UserResponse } from "@/entities/user/types"
import { Skeleton } from "@/shared/components/ui/skeleton"
import DepartmentPersonsList from "./DepartmentPersonsList"

const icons = {
  SALES: <BadgeRussianRuble />,
  TECHNICAL: <Wrench />,
  MARKETING: <ChartNoAxesCombined />,
}

const urlPath = (depsId: number): Record<UnionTypeDepartmentsName, string> => ({
  SALES: `/dashboard/table/${depsId}`,
  TECHNICAL: "",
  MARKETING: `/dashboard/statistics/request-source`,
})

const DepartmentListWrapper = () => {
  const { departments, setDepartments } = useStoreDepartment()

  const { data: departmentData, isLoading, isError } = useGetDepartmentsWithUsers()

  useEffect(() => {
    if (departmentData) {
      setDepartments(departmentData)
    }
  }, [departmentData, setDepartments])

  const navMainItems = useMemo(() => {
    if (!departments || !departments.length) {
      return []
    }
    return (departments as DepartmentInfo[]).map((dept: DepartmentInfo) => ({
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
        url: urlPath(person.departmentId)[dept.name],
      })),
    })) as DepartmentListItemType[]
  }, [departments])

  const data: { navMain: DepartmentListItemType[] } = {
    navMain: navMainItems,
  }

  if (isLoading) {
    return (
      <div className="top-0 h-[calc(100svh-var(--header-height))]! min-w-60 shrink-0 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton className="h-10 w-full" key={`${Date.now}-${i}`} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="top-0 h-[calc(100svh-var(--header-height))]! min-w-60 shrink-0 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        <p className="text-sm text-destructive p-2 border border-red-400 rounded-md">
          Ошибка загрузки отделов
        </p>
      </div>
    )
  }

  if (!navMainItems.length) {
    return (
      <div className="top-0 h-[calc(100svh-var(--header-height))]! min-w-60 shrink-0 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        <p className="text-sm text-muted-foreground">Нет отделов</p>
      </div>
    )
  }
  return (
    <>
      {(data.navMain.length ? data.navMain : []).map((item) => (
        <DepartmentPersonsList item={item} key={item.id} />
      ))}
    </>
  )
}

export default DepartmentListWrapper
