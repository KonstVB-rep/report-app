import { z } from "zod"

export const SingleContactFormSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, { error: "Имя обязательно" }),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
  })
  .refine((contact) => contact.phone?.trim() || contact.email?.trim(), {
    error: "Укажите либо телефон, либо email",
    path: ["_common"],
  })

export const ContactFormSchema = z.object({
  contacts: z.array(SingleContactFormSchema),
})

export type ContactSchema = z.infer<typeof ContactFormSchema>
export type SingleContactSchema = z.infer<typeof SingleContactFormSchema>
