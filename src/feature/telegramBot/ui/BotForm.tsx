import type { BotFormData } from "@/entities/tgBot/types"
import { Input } from "@/shared/components/ui/input"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import type { ActionResponse } from "@/shared/types"

type BotFormProps = {
  state: ActionResponse<BotFormData>
  isPending: boolean
  actionSubmit: (data: FormData) => void
}

const BotForm = ({ state, isPending, actionSubmit }: BotFormProps) => {
  const getFieldError = (fieldName: keyof BotFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0]
  }

  return (
    <form action={actionSubmit} autoComplete="on" className="space-y-6">
      <Input
        aria-describedby="botName"
        className={getFieldError("botName") ? "border-red-500" : ""}
        defaultValue={state.inputs?.botName}
        disabled={isPending}
        minLength={3}
        name="botName"
        placeholder="Название бота..."
        required
      />

      {getFieldError("botName") && (
        <p className="text-sm text-red-500" id="botName">
          {getFieldError("botName")}
        </p>
      )}

      <Input
        aria-describedby="description"
        className={getFieldError("description") ? "border-red-500" : ""}
        defaultValue={state.inputs?.description}
        disabled={isPending}
        minLength={5}
        name="description"
        placeholder="Описание бота..."
        required
      />

      {getFieldError("description") && (
        <p className="text-sm text-red-500" id="description">
          {getFieldError("description")}
        </p>
      )}

      <Input
        aria-describedby="token"
        className={getFieldError("token") ? "border-red-500" : ""}
        defaultValue={state.inputs?.token}
        disabled={isPending}
        minLength={10}
        name="token"
        placeholder="Токен..."
        required
      />

      {getFieldError("token") && (
        <p className="text-sm text-red-500" id="token">
          {getFieldError("token")}
        </p>
      )}

      <SubmitFormButton className="ml-auto mr-2 w-max" isPending={isPending} title="Сохранить" />
    </form>
  )
}

export default BotForm
