import type { ReactNode } from "react"
import type { UserResponse } from "@/entities/user/types"

export const Departments = {
  SALES: "SALES",
  TECHNICAL: "TECHNICAL",
  MARKETING: "MARKETING",
} as const

export type DepartmentUnion = keyof typeof Departments // "SALES" | "TECHNICAL" | "MARKETING"

export type DepartmentInfo = {
  id: number
  name: DepartmentUnion
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

export const DEPARTMENTS = ["SALES", "TECHNICAL", "MARKETING"] as const

export type DepartmentValue = (typeof DEPARTMENTS)[number]
