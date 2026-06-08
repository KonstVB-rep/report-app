// "use server"

// import { type PermissionEnum, Role } from "@prisma/client"
// import { requireUser } from "@/app/api/utils/requireAuth"

// export const checkRole = async (role: Role = Role.ADMIN): Promise<boolean> => {
//   try {
//     const payload = await requireUser()

//     if (!payload) {
//       return false
//     }

//     return payload.role === role
//   } catch (error) {
//     console.error("Ошибка при проверке прав доступа:", error)
//     return false
//   }
// }

// export const checkDepartment = async (depId: number): Promise<boolean> => {
//   try {
//     const payload = await requireUser()

//     if (!payload) {
//       return false
//     }
//     if (payload.role === Role.ADMIN) {
//       return true
//     }

//     return payload?.departmentId === depId
//   } catch (error) {
//     console.error("Ошибка при проверке прав доступа:", error)
//     return false
//   }
// }

// export const checkPermission = async (permission: PermissionEnum): Promise<boolean> => {
//   try {
//     const payload = await requireUser()

//     if (!payload) {
//       return false
//     }

//     if (payload.role === Role.ADMIN) {
//       return true
//     }

//     return payload.permissions.some((p) => p === permission)
//   } catch (error) {
//     console.error("Ошибка при проверке прав доступа:", error)
//     return false
//   }
// }
