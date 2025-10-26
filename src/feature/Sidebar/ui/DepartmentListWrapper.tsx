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
import { Sidebar } from "@/shared/components/ui/sidebar"
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
  const { departments } = useStoreDepartment()
  const { setDepartments } = useStoreDepartment()

  const { data: departmentData } = useGetDepartmentsWithUsers()

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

  if (!departments || !departments.length) {
    return (
      <Sidebar className="top-0 h-[calc(100svh-var(--header-height))]! min-w-64 shrink-0 animate-pulse bg-primary-foreground"></Sidebar>
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
