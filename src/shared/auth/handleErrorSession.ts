import { TOAST } from "../ui/Toast";
import { logout } from "./logout";

const handleErrorSession = (error: Error) => {
  const err = error as Error & { status?: number };

  if (err.status === 401 || err.message === "Сессия истекла") {
    TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
    logout();
    return;
  }

  const errorMessage =
    err.message === "Failed to fetch" ? "Ошибка соединения" : err.message;

  TOAST.ERROR(errorMessage);
};

export default handleErrorSession;
