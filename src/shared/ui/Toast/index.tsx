import { toast } from "sonner";

export const TOAST = {
  ERROR: (message: string) =>
    toast.error(message, {
      duration: 3000,
      icon: "",
      position: "top-center",
      style: {
        border: "1px solid oklch(0.577 0.245 27.325)",
        borderRadius: "30px",
        height: "50px",
        color: "oklch(0.577 0.245 27.325)",
        backgroundColor: "#azure",
        maxWidth: "400px",
        minWidth: "12rem",
        margin:"auto",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    }),
  SUCCESS: (message: string) =>
    toast.success(message, {
      duration: 3000,
      position: "top-center",
      style: {
        border: "2px solid oklch(0.723 0.219 149.579)",
        borderRadius: "30px",
        height: "50px",
        color: "green",
        backgroundColor: "#azure",
        maxWidth: "400px",
        minWidth: "12rem",
        margin:"auto",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",

      },
    }),
  PROMISE: (promise: Promise<unknown>, messageSuccess: string) =>
    toast.promise(promise, {
      loading: "Выполняется",
      success: {
        message: messageSuccess,
        style: {
          border: "1px solid oklch(0.723 0.219 149.579)",
          borderRadius: "30px",
          color: "green",
          maxWidth: "400px",
          margin:"auto"
        },
      },
      error: (err) => {
        return {
          message: err.message || "Произошла ошибка",
          style: {
            border: "1px solid oklch(0.577 0.245 27.325)",
            borderRadius: "30px",
            color: "oklch(0.577 0.245 27.325)",
            maxWidth: "400px",
            margin:"auto"
          },
        };
      },
      style: {
        backgroundColor: "oklch(0.809 0.105 251.813)",
        margin:"auto",
        maxWidth: "400px",
      },
      duration: 3000,
      icon: null,
    }),
};
