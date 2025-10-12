import type { BotData } from "@/entities/tgBot/types"
import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog"
import { useDeleteBot } from "../hooks/mutate"

type DeleteBotProps = {
  bot: BotData
}

const DialogDeleteBot = ({ bot }: DeleteBotProps) => {
  const { mutate, isPending } = useDeleteBot()

  return (
    <DeleteDialog
      description="Вы действительно хотите удалить бот?"
      isPending={isPending}
      mutate={() => mutate(bot.id)}
      title="Удалить"
    >
      <p className="text-center">Вы уверены что хотите удалить бот?</p>
      <p className="grid text-center">
        <span> Бот: </span>
        <span className="text-lg font-bold capitalize">{bot.botName}</span>
        <span>будет удален безвозвратно</span>
      </p>
    </DeleteDialog>
  )
}

export default DialogDeleteBot
