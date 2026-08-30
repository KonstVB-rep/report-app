import { redirect } from "next/navigation"
import useStoreUser, { selectAuthUser } from "@/entities/user/store/useStoreUser"
import { PERMISSIONS } from "@/shared/lib/constants"

const useIsReadonly = () => {
  const authUser = useStoreUser(selectAuthUser)

  if (!authUser) redirect("/login")

  if (authUser.permissions.includes(PERMISSIONS.READ_ONLY)) return true

  return false
}

export default useIsReadonly
