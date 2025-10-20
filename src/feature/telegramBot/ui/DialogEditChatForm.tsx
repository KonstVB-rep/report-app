import type { UserTelegramChat } from "@prisma/client"
import { PencilIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { UpdateUserChatForm } from "./UpdateUserChatForm"

const DialogEditChatForm = ({
  chat,
  textButtonShow = false,
}: {
  chat: UserTelegramChat
  textButtonShow?: boolean
}) => {
  return (
    <DialogComponent
      classNameContent="w-fit p-6 md:p-6"
      trigger={
        <Button
          className="self-start flex gap-2"
          size={!textButtonShow ? "icon" : "default"}
          title="Изменить чат"
          variant="outline"
        >
          {textButtonShow && <span className="text-sm text-muted-foreground">Изменить чат</span>}
          <PencilIcon />
        </Button>
      }
    >
      <UpdateUserChatForm chat={chat} />
    </DialogComponent>
  )
}

export default DialogEditChatForm
