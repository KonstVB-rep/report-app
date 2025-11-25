import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { getDepartmentsWithUsers } from "../api"
import useStoreDepartment from "../store/useStoreDepartment"

export const useGetDepartmentsWithUsers = () => {
  const { authUser, isAuth } = useStoreUser()
  const { setDepartments } = useStoreDepartment()

  return useQuery({
    queryKey: ["depsWithUsers"],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        const deps = await getDepartmentsWithUsers()
        setDepartments(deps)

        return deps
      } catch (error) {
        console.error("Ошибка useGetDepartmentsWithUsers:", error)

        if (error instanceof Error && error.message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
          return null
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          TOAST.ERROR(`Prisma ошибка: ${error.code}`)
        } else if (error instanceof Prisma.PrismaClientValidationError) {
          TOAST.ERROR("Ошибка валидации данных")
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
          TOAST.ERROR("Ошибка подключения к базе")
        } else if (error instanceof Error) {
          TOAST.ERROR(error.message)
        } else {
          TOAST.ERROR("Неизвестная ошибка")
        }

        return null
      }
    },
    enabled: isAuth,
  })
}
