import { PermissionEnum } from "@prisma/client"
import { redirect } from "next/navigation"
import useStoreUser, { selectAuthUser } from "@/entities/user/store/useStoreUser"

const useIsReadonly = () => {
  const authUser = useStoreUser(selectAuthUser)

  if (!authUser) redirect("/login")

  if (authUser.permissions.includes(PermissionEnum.READ_ONLY)) return true

  return false
}

export default useIsReadonly
