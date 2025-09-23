import React, { useActionState, useEffect } from "react";

import { usePathname } from "next/navigation";

import { SquarePen } from "lucide-react";

import { BotFormData } from "@/entities/tgBot/types";
import EditDataDialog from "@/shared/custom-components/ui/EditDialog";
import { TOAST } from "@/shared/custom-components/ui/Toast";

import { updateBot } from "../actions/bot";
import WrapperBotForm from "./WrapperBotForm";

const DialogEditBot = ({ bot }: { bot: BotFormData }) => {
  const [state, formAction, isPending] = useActionState(updateBot, {
    success: false,
    message: "",
    inputs: bot,
  });
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      TOAST.SUCCESS(state.message);
    }
  }, [state.success, state.message]);

  const actionSubmit = (data: FormData) => {
    data.append("pathname", pathname);
    formAction(data);
  };
  return (
    <EditDataDialog icon={<SquarePen size={40} />} title="Редактировать">
      <WrapperBotForm
        title="Редактировать"
        description="Заполните форму для создания бота"
        state={state}
        isPending={isPending}
        actionSubmit={actionSubmit}
      />
    </EditDataDialog>
  );
};

export default DialogEditBot;
