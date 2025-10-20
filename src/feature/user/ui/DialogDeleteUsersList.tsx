"use client"

import type { UserOmit } from "@/entities/user/types"
import { useDeleteUsersList } from "@/feature/user/hooks/mutate"
import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog"

const DialogDeleteUsersList = ({
  users,
  textButtonShow = false,
  className,
}: {
  users: UserOmit[]
  textButtonShow?: boolean
  className?: string
}) => {
  const dataUsers = users.map((user) => user.id)
  const { mutate, isPending } = useDeleteUsersList(dataUsers)

  return (
    <DeleteDialog
      className={className}
      description="Вы действительно хотите удалить пользователей?"
      isPending={isPending}
      mutate={mutate}
      textButtonShow={textButtonShow}
      title="Удалить список"
    >
      <p className="text-center">Вы уверены что хотите удалить аккаунты?</p>
      <div className="grid text-center relative">
        <div> Пользователей: </div>
        <ol className="text-md list-decimal font-semibold capitalize max-h-60 overflow-y-auto grid gap-1 p-2 bg-black/10 dark:bg-black rounded">
          {users.map((user, index) => (
            <li className="flex items-center justify-start gap-2" key={user.id}>
              <span>{index + 1}. </span>
              {user.username}
            </li>
          ))}
        </ol>
        <span>будут удалены безвозвратно</span>
      </div>
    </DeleteDialog>
  )
}

export default DialogDeleteUsersList
