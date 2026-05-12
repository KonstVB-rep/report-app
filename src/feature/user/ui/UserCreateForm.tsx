"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { UserFormData } from "@/entities/user/types"
import UserForm from "@/entities/user/ui/UserForm"
import Overlay from "@/shared/custom-components/ui/Overlay"
import type { ActionResponse } from "@/shared/types"
import { useCreateUser } from "../hooks/mutate"

const initialState: ActionResponse<UserFormData> = {
  success: false,
  message: "",
}

const UserCreateForm = () => {
  const [state, setState] = useState(initialState)

  const { mutateAsync, isPending } = useCreateUser((data: ActionResponse<UserFormData>) => {
    if (!data.success) {
      setState(data)
    }
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    mutateAsync(formData)
  }

  useEffect(() => {
    let toastId: string | number | null = null

    if (isPending) {
      toastId = toast.loading("Идет создание пользователя...")
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

export default UserCreateForm
