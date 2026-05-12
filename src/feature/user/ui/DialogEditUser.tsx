"use client"

import { useEffect, useState } from "react"
import { UserPen } from "lucide-react"
import dynamic from "next/dynamic"
import type { UserOmit, UserWithdepartmentName } from "@/entities/user/types"
import UserFormSkeleton from "@/entities/user/ui/UserFormSkeleton"
import { useGetUser } from "@/feature/user/hooks/query"
import EditDataDialog from "@/shared/custom-components/ui/EditDialog"
import { TOAST } from "@/shared/custom-components/ui/Toast"

const UserEditForm = dynamic(() => import("@/feature/user/ui/UserEditForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
})

const DialogEditUser = ({
  user,
  textButtonShow = false,
  className,
}: {
  user: UserOmit
  textButtonShow?: boolean
  className?: string
}) => {
  const { data, isLoading, isError } = useGetUser(user.id)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isError) {
      TOAST.ERROR("Ошибка при загрузке данных пользователя")
      console.error("Ошибка при загрузке данных пользователя")
    }
  }, [isError])

  if (!user.id) return null

  return (
    <EditDataDialog
      className={className}
      icon={<UserPen size={40} />}
      open={open}
      setOpen={setOpen}
      textButtonShow={textButtonShow}
      title="Редактировать пользователя"
    >
      {isLoading ? (
        <UserFormSkeleton />
      ) : (
        <UserEditForm setOpen={setOpen} user={data as UserWithdepartmentName} />
      )}
    </EditDataDialog>
  )
}

export default DialogEditUser
