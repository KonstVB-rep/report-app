"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { userUpdateFormSchema } from "@/entities/user/model/schema"
import type { UserFormEditData, UserWithdepartmentName } from "@/entities/user/types"
import UserForm from "@/entities/user/ui/UserForm"
import Overlay from "@/shared/custom-components/ui/Overlay"
import type { ActionResponse } from "@/shared/types"
import { useUpdateUser } from "../hooks/mutate"

const initialState: ActionResponse<UserFormEditData> = {
  success: false,
  message: "",
}

const UserEditForm = ({
  user,
  setOpen,
}: {
  user: UserWithdepartmentName | undefined
  setOpen: (value: boolean) => void
}) => {
  const [state, setState] = useState(initialState)

  const { mutateAsync, isPending } = useUpdateUser(
    user?.id as string,
    (data: ActionResponse<UserFormEditData>) => {
      setState(data)
      if (data.success) {
        setOpen(false)
      }
    },
  )

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    let permissions: string[] = []
    try {
      const rawPermissions = formData.get("permissions") as string
      permissions = rawPermissions ? JSON.parse(rawPermissions) : []
    } catch (_error) {
      toast.error("Ошибка в данных прав доступа")
      return
    }

    const rawData = {
      id: formData.get("id") as string,
      username: formData.get("username") as string,
      phone: (formData.get("phone") as string) || "",
      email: formData.get("email") as string,
      position: formData.get("position") as string,
      department: formData.get("department") as string,
      role: formData.get("role") as string,
      permissions,
      isBlocked: formData.get("isBlocked") === "on" || formData.get("isBlocked") === "true",
      emailNotify: formData.get("emailNotify") === "on" || formData.get("emailNotify") === "true",
    }

    const validated = userUpdateFormSchema.safeParse(rawData)

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors
      const firstError = Object.values(errors).flat()[0]

      setState({
        ...initialState,
        message: firstError || "Ошибка валидации формы",
        success: false,
      })
      toast.error(firstError || "Ошибка валидации формы")
      return
    }

    setState({
      ...initialState,
      inputs: validated.data,
    })

    mutateAsync(formData)
  }

  useEffect(() => {
    if (!user) {
      return
    }

    setState({
      ...initialState,
      inputs: {
        username: user.username,
        phone: user.phone || "",
        email: user.email,
        position: user.position,
        department: user.departmentName,
        role: user.role,
        permissions: user.permissions,
        isBlocked: user.isBlocked,
        emailNotify: user.emailNotify,
      },
    })
  }, [user])

  useEffect(() => {
    let toastId: string | number | null = null

    if (isPending) {
      toastId = toast.loading("Идет сохранение...")
    } else {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }, [isPending])

  return (
    <>
      <Overlay isPending={isPending} />
      <UserForm isPending={isPending} onSubmit={onSubmit} setState={setState} state={state} />
    </>
  )
}

export default UserEditForm
