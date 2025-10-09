import { Plus } from "lucide-react";

import { BotData } from "@/entities/tgBot/types";
import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

import { CreateUserChatForm } from "./CreateUserChatForm";

const DialogCreateChatForm = ({
  bot,
  textButtonShow = false,
}: {
  bot: BotData;
  textButtonShow?: boolean;
}) => {
  return (
    <DialogComponent
      classNameContent="w-fit p-6 md:p-6"
      trigger={
        <Button
          variant="outline"
          title="Добавить чат"
          size={!textButtonShow ? "icon" : "default"}
          className="self-start flex gap-2"
        >
          {textButtonShow && (
            <span className="text-sm text-muted-foreground">Добавить чат</span>
          )}
          <Plus />
        </Button>
      }
    >
      <CreateUserChatForm bot={bot} />
    </DialogComponent>
  );
};

export default DialogCreateChatForm;
