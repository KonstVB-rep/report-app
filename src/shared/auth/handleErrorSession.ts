import { TOAST } from "../custom-components/ui/Toast"
import { logout } from "./logout"

const handleErrorSession = (error: unknown) => {
  let message = "Произошла ошибка"
  let code = 0

  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === "object" && error !== null && "error" in error) {
    const err = error as { error: string; code?: number }
    message = err.error
    code = err.code || 0
  }

  if (code === 401 || message === "Сессия истекла" || message === "UNAUTHORIZED") {
    TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.")
    logout()
    return
  }

  const finalMessage = message === "Failed to fetch" ? "Ошибка соединения с сервером" : message

  TOAST.ERROR(finalMessage)
}

export default handleErrorSession
