"use server"

import { cache } from "react"
import { getUserFromCookie } from "@/shared/lib/auth/getUserFromCookie"

export const getUserPermissions = cache(async () => {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return { permissions: [], role: null, departmentId: null }
    }

    const data = {
      permissions: user.permissions || [],
      role: user.role || null,
      departmentId: user.departmentId ?? null,
    }

    return data
  } catch (error) {
    console.error("Error getting permissions:", error)
    return { permissions: [], role: null, departmentId: null }
  }
})
