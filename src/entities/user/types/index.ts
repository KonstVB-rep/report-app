import { type DepartmentEnum, PermissionEnum, type Role } from "@prisma/client"
import { PermissionUser } from "../model/objectTypes"

export type User = {
  id: string
  username: string
  phone: string
  user_password: string
  email: string
  position: string
  departmentId: number
  role: Role
  lastlogin?: Date | null
  createdAt: Date
  updatedAt: Date
  permissions?: PermissionEnum[]
  tgUserId?: string
  tgUserName?: string
}

export type UserOmit = Omit<User, "user_password" | "lastlogin" | "createdAt" | "updatedAt">

export type UserWithdepartmentName = Omit<
  User,
  "user_password" | "lastlogin" | "createdAt" | "updatedAt"
> & {
  departmentName: DepartmentEnum
}

export type UserRequest = Omit<
  User,
  "id" | "lastlogin" | "createdAt" | "updatedAt" | "departmentId"
> & {
  department: DepartmentEnum
  permissions: PermissionType[]
}
export type UserResponse = Omit<User, "lastlogin" | "createdAt" | "updatedAt" | "user_password">

export type Option = {
  label: string
  value: PermissionEnum
  disable?: boolean
}

export const OPTIONS: Option[] = [
  {
    label: PermissionUser.VIEW_USER_REPORT,
    value: PermissionEnum.VIEW_USER_REPORT,
  },
  {
    label: PermissionUser.VIEW_UNION_REPORT,
    value: PermissionEnum.VIEW_UNION_REPORT,
  },
  {
    label: PermissionUser.DOWNLOAD_REPORTS,
    value: PermissionEnum.DOWNLOAD_REPORTS,
  },
  {
    label: PermissionUser.USER_MANAGEMENT,
    value: PermissionEnum.USER_MANAGEMENT,
  },
  {
    label: PermissionUser.DEAL_MANAGEMENT,
    value: PermissionEnum.DEAL_MANAGEMENT,
  },
  {
    label: PermissionUser.TASK_MANAGEMENT,
    value: PermissionEnum.TASK_MANAGEMENT,
  },
]

export type PermissionType = keyof typeof PermissionEnum

export type UserDataBase = {
  id?: string
  username: string
  phone: string
  email: string
  position: string
  department: DepartmentEnum
  role: Role
  permissions?: PermissionEnum[]
}

export type UserFormData = UserDataBase & {
  user_password: string
}

export type UserFormEditData = UserDataBase & {
  id: string
  user_password?: string | undefined
}
