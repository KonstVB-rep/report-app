import type React from "react"
import { PermissionEnum } from "@prisma/client"
import { useParams } from "next/navigation"
import z from "zod"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useGetUser } from "@/feature/user/hooks/query"
import ErrorMessageTable from "./ErrorMessageTable"
import DealsSkeleton from "./Skeletons/DealsSkeleton"

type DealTableTemplateProps = {
  children: React.ReactNode
}

const DealTableTemplate = ({ children }: DealTableTemplateProps) => {
  const { userId } = useParams<{ userId: string }>()
  const { authUser } = useStoreUser()

  const currentUserId = userId ?? authUser?.id

  const {
    data: user,
    error,
    isPending,
  } = useGetUser(currentUserId, [PermissionEnum.VIEW_USER_REPORT])

  if (isPending) return <DealsSkeleton />

  if (!user) {
    return <ErrorMessageTable message={error?.message || "Пользователь не найден"} />
  }

  return <section className="h-full p-2 grid gap-2 content-start">{children}</section>
}

export default DealTableTemplate
