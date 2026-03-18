"use server"

import { requireUser } from "@/app/api/utils/requireAuth "
export async function getUserPermissions() {
  try {
    const user = await requireUser()

    if (!user) {
      return { permissions: [], role: null, departmentId: null }
    }

    return {
      permissions: user.permissions || [],
      role: user.role || null,
      departmentId: user.departmentId ?? null, // Исправлено: depatmentId → departmentId
    }
  } catch (error) {
    console.error("Error getting permissions:", error)
    return { permissions: [], role: null, departmentId: null }
  }
}
