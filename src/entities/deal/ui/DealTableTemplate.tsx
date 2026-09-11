import type React from "react"
import { useParams } from "next/navigation"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useGetUser } from "@/feature/user/hooks/query"
import { PERMISSIONS } from "@/shared/lib/constants"
import ErrorMessageTable from "./ErrorMessageTable"

type DealTableTemplateProps = {
  children: React.ReactNode
}

const DealTableTemplate = ({ children }: DealTableTemplateProps) => {
  const { userId } = useParams<{ userId: string }>()
  const { authUser } = useStoreUser()

  const currentUserId = userId ?? authUser?.id

  const { data: user, error, isPending } = useGetUser(currentUserId, [PERMISSIONS.VIEW_USER_REPORT])

  if (!user && !isPending) {
    return <ErrorMessageTable message={error?.message || "Пользователь не найден"} />
  }

  return <section className="h-full p-2 grid gap-2 content-start">{children}</section>
}

export default DealTableTemplate
