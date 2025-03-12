import { toast } from "sonner";

export const TOAST = {
  ERROR: (message: string) =>
    toast.error(message, {
      duration: 3000,
      position: "top-center",
      style: {
        border: "1px solid oklch(0.577 0.245 27.325)",
        borderRadius: "30px",
        height: "50px",
        color: "oklch(0.577 0.245 27.325)",
        backgroundColor: "#azure",
        maxWidth: "fit-content",
      },
      className: "animate__fadeInDown",
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
        maxWidth: "fit-content",
      },
      className: "animate__fadeInDown",
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
          backgroundColor: "#azure",
          maxWidth: "fit-content",
        },
      },
      error: (err) => ({
        message: err.message,
        style: {
          border: "1px solid oklch(0.577 0.245 27.325)",
          borderRadius: "30px",
          color: "oklch(0.577 0.245 27.325)",
          backgroundColor: "#azure",
          maxWidth: "fit-content",
        },
      }),
      style: {
        backgroundColor: "oklch(0.809 0.105 251.813)",
      },
      duration: 3000,
      icon: null,
    }),
};
