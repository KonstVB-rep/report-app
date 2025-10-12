import type { BotFormData, ChatFormData } from "@/entities/tgBot/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent"
import type { ActionResponse } from "@/shared/types"
import useChatForm from "../hooks/useChatForm"

type ChatFormProps = {
  title: string
  description: string
  bot: BotFormData
  mutateAsync: (data: FormData) => Promise<ActionResponse<ChatFormData>>
  state: ActionResponse<ChatFormData>
  isPending: boolean
}

const ChatForm = ({ title, description, bot, mutateAsync, state, isPending }: ChatFormProps) => {
  const {
    actionSubmit,
    getFieldError,
    selectedUser,
    setSelectedUser,
    isActive,
    setIsActive,
    managers,
  } = useChatForm(bot, mutateAsync, state)

  return (
    <Card className="w-full max-w-sm m-auto border-none p-4">
      <CardHeader className="px-2! pt-4!">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-2!">
        <form action={actionSubmit} autoComplete="on" className="space-y-6">
          <div className="grid gap-2 p-2  bg-secondary rounded">Бот: {bot.botName}</div>
          <SelectComponent
            disabled={isPending}
            name="userId"
            onValueChange={setSelectedUser}
            options={[...Object.entries(managers)]}
            placeholder="Выберите пользователя"
            required
            value={selectedUser}
          />

          <Input
            aria-describedby="username"
            className={getFieldError("username") ? "border-red-500" : ""}
            defaultValue={state.inputs?.username}
            disabled={isPending}
            minLength={3}
            name={"username"}
            placeholder="Ник..."
            required
          />

          {getFieldError("username") && (
            <p className="text-sm text-red-500" id="username">
              {getFieldError("username")}
            </p>
          )}

          <Input
            aria-describedby="chatId"
            className={getFieldError("chatId") ? "border-red-500" : ""}
            defaultValue={state.inputs?.chatId}
            disabled={isPending}
            minLength={3}
            name={"chatId"}
            placeholder="ID чата..."
            required
          />

          {getFieldError("chatId") && (
            <p className="text-sm text-red-500" id="chatId">
              {getFieldError("chatId")}
            </p>
          )}

          <Input
            aria-describedby="telegramUserInfoId"
            className={getFieldError("telegramUserInfoId") ? "border-red-500" : ""}
            defaultValue={state.inputs?.telegramUserInfoId}
            disabled={isPending}
            minLength={3}
            name={"telegramUserInfoId"}
            placeholder="ID информации о Telegram пользователе..."
            required
          />

          {getFieldError("telegramUserInfoId") && (
            <p className="text-sm text-red-500" id="telegramUserInfoId">
              {getFieldError("telegramUserInfoId")}
            </p>
          )}

          <Input
            aria-describedby="chatName"
            className={getFieldError("chatName") ? "border-red-500" : ""}
            defaultValue={state.inputs?.chatName}
            disabled={isPending}
            minLength={3}
            name={"chatName"}
            placeholder="Имя чата..."
            required
          />

          {getFieldError("chatName") && (
            <p className="text-sm text-red-500" id="chatName">
              {getFieldError("chatName")}
            </p>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive-chat"
              onCheckedChange={setIsActive}
              value={isActive ? "true" : "false"}
            />
            <Label htmlFor="isActive-chat">{isActive ? "Активен" : "Не активен"}</Label>
          </div>

          <SubmitFormButton
            className="ml-auto mr-2 w-max"
            isPending={isPending}
            title="Сохранить"
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default ChatForm
