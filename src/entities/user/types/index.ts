import type { DepartmentValue } from "@/entities/department/types"
import { PERMISSIONS, type PERMISSIONS_UNION } from "@/shared/lib/constants"
import { PermissionUser, type RoleValue } from "../model/objectTypes"

const Roles = {
  DIRECTOR: "DIRECTOR",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
}

export type RoleUnion = keyof typeof Roles

export type User = {
  id: string
  username: string
  phone?: string | null
  user_password: string
  email: string
  position: string
  departmentId: number
  role: RoleUnion
  lastlogin?: Date | null
  createdAt: Date
  updatedAt: Date
  permissions?: PERMISSIONS_UNION[]
  tgUserId?: string
  tgUserName?: string
  isBlocked: boolean
  emailNotify: boolean
}

export type UserOmit = Omit<User, "user_password" | "lastlogin" | "createdAt" | "updatedAt">

export type UserWithdepartmentName = Omit<
  User,
  "user_password" | "lastlogin" | "createdAt" | "updatedAt"
> & {
  departmentName: DepartmentValue
}

export type UserResponse = Omit<User, "lastlogin" | "createdAt" | "updatedAt" | "user_password">

export type Option = {
  label: string
  value: PERMISSIONS_UNION
  disable?: boolean
}

export const OPTIONS: Option[] = [
  {
    label: PermissionUser.VIEW_USER_REPORT,
    value: PERMISSIONS.VIEW_USER_REPORT,
  },
  {
    label: PermissionUser.VIEW_UNION_REPORT,
    value: PERMISSIONS.VIEW_UNION_REPORT,
  },
  {
    label: PermissionUser.DOWNLOAD_REPORTS,
    value: PERMISSIONS.DOWNLOAD_REPORTS,
  },
  {
    label: PermissionUser.USER_MANAGEMENT,
    value: PERMISSIONS.USER_MANAGEMENT,
  },
  {
    label: PermissionUser.DEAL_MANAGEMENT,
    value: PERMISSIONS.DEAL_MANAGEMENT,
  },
  {
    label: PermissionUser.TASK_MANAGEMENT,
    value: PERMISSIONS.TASK_MANAGEMENT,
  },
  {
    label: PermissionUser.DEAL_DELETE,
    value: PERMISSIONS.DEAL_DELETE,
  },
  {
    label: PermissionUser.EQUIPMENT_DELETE,
    value: PERMISSIONS.EQUIPMENT_DELETE,
  },
  {
    label: PermissionUser.EQUIPMENT_MANAGEMENT,
    value: PERMISSIONS.EQUIPMENT_MANAGEMENT,
  },
  {
    label: PermissionUser.READ_ONLY,
    value: PERMISSIONS.READ_ONLY,
  },
]

export type PermissionType = keyof typeof PERMISSIONS

export type UserDataBase = {
  id?: string
  username: string
  phone?: string | null
  email: string
  position: string
  department: DepartmentValue
  role: RoleValue
  permissions?: PERMISSIONS_UNION[]
  isBlocked: boolean
  emailNotify: boolean
}

export type UserFormData = UserDataBase & {
  user_password: string
}

export type UserFormEditData = UserDataBase & {
  id: string
  user_password?: string | undefined
}
