import type { ReactNode } from "react"
import type { DepartmentEnum } from "@prisma/client"
import type { UserResponse } from "@/entities/user/types"
import type { DepartmentLabels } from "../lib/constants"

export type DepartmentInfo = {
  id: number
  name: DepartmentEnum
  directorId: string
  description: string
  users: UserResponse[]
}

export type DepartmentUserItem = {
  id: string
  departmentId: number
  username: string
  position: string
  url: string
}

export type DepartmentListItemType = {
  id: number
  title: string
  icon?: ReactNode
  url: string
  directorId: string
  items: DepartmentUserItem[]
}

export type DepartmentsUnionIds = 1 | 2 | 3

export type UnionTypeDepartmentsName = keyof typeof DepartmentLabels
