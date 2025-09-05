import { Button } from '@/shared/components/ui/button'
import DialogComponent from '@/shared/custom-components/ui/DialogComponent'
import { Plus } from 'lucide-react'
import React from 'react'

import { UserTelegramChat } from '@prisma/client'
import { UpdateUserChatForm } from './UpdateUserChatForm'


const DialogEditChatForm = ({chat, textButtonShow=false}: {chat: UserTelegramChat, textButtonShow?: boolean}) => {
  return (
      <DialogComponent
        classNameContent="w-fit"
        trigger={
          <Button
            variant="outline"
            title="Изменить чат"
            size={!textButtonShow ? "icon" : "default"}
            className="self-start flex gap-2"
          >
            {textButtonShow && <span className="text-sm text-muted-foreground">Изменить чат</span>}
            <Plus />
          </Button>
        }
      >
        <UpdateUserChatForm chat={chat} />
      </DialogComponent>
  )
}

export default DialogEditChatForm