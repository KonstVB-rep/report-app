import z from "zod";

export const loginFormSchema = z.object({
  email: z.email("Некорректный Email"),
  password: z
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .max(30, "Пароль должен содержать не более 30 символов"),
});


export type LoginSchema = z.infer<typeof loginFormSchema>