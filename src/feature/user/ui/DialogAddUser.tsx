"use client"

import { PermissionEnum } from "@prisma/client"
import { SquarePlus } from "lucide-react"
import dynamic from "next/dynamic"
import UserFormSkeleton from "@/entities/user/ui/UserFormSkeleton"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { cn } from "@/shared/lib/utils"

const UserCreateForm = dynamic(() => import("@/feature/user/ui/UserCreateForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
})

const DialogAddUser = ({ className }: { className?: string }) => {
  return (
    <ProtectedByPermissions permission={PermissionEnum.USER_MANAGEMENT}>
      <DialogComponent
        classNameContent="w-full sm:max-w-[600px]"
        dialogTitle="Форма добавления пользователя"
        trigger={
          <Button
            aria-label="Новый пользователь"
            className={cn("btn_hover", className)}
            variant="outline"
          >
            <SquarePlus size={16} />
            <span className="whitespace-nowrap text-sm text-start">Добавить пользователя</span>
          </Button>
        }
      >
        <UserCreateForm />
      </DialogComponent>
    </ProtectedByPermissions>
  )
}

export default DialogAddUser
