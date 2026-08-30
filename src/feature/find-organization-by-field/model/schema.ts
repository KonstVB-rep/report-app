import { z } from "zod"

const searchFields = ["inn", "orgName", "phone", "email"] as const
export type SearchType = (typeof searchFields)[number]

export const findOrgSchema = z.discriminatedUnion("searchType", [
  z.object({
    searchType: z.literal("inn"),
    value: z
      .string()
      .trim()
      .refine((val) => val.length === 10 || val.length === 12, {
        message: "Некорректный ИНН, должен быть 10 или 12 символов",
      }),
  }),
  z.object({
    searchType: z.literal("orgName"),
    value: z.string().trim().min(2, "Название организации должно быть не менее 2 символов"),
  }),
  z.object({
    searchType: z.literal("phone"),
    value: z.string().trim().min(16, "Введите номер телефона полностью"), // Жестко требуем заполнения маски
  }),
  z.object({
    searchType: z.literal("email"),
    value: z.string().trim().email("Некорректная электронная почта"),
  }),
])
