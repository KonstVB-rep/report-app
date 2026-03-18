"use client"

import useStoreUser from "@/entities/user/store/useStoreUser"
import { capitalizeFullName } from "@/shared/lib/utils"
import useStoreDepartment, { type DeptFormatted } from "../store/useStoreDepartment"
import { NOT_MANAGERS_POSITIONS } from "./constants"

type Dept = {
  id: number
  name: string
  description: string
  users: {
    id: string
    username: string
  }[]
}

export const formattedArr = <T extends Dept>(arr: T[] | null): DeptFormatted[] | null => {
  if (!arr || arr.length === 0) return null

  return arr.map((dept) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    users: Object.fromEntries(dept.users.map((user) => [user.id, user.username])),
  }))
}

const NOT_MANAGERS_SET = new Set(Object.values(NOT_MANAGERS_POSITIONS))

export const getUsers = (data: { onlyManagers: boolean }) => {
  const { authUser } = useStoreUser.getState()
  const { departments } = useStoreDepartment.getState()

  const dept = departments?.find((d) => d.id === authUser?.departmentId)
  if (!dept) return {}

  const result: Record<string, string> = {}

  for (const user of dept.users) {
    const isNotManager = NOT_MANAGERS_SET.has(user.position)

    if (!data.onlyManagers || !isNotManager) {
      result[user.id] = capitalizeFullName(user.username)
    }
  }

  return result
}
