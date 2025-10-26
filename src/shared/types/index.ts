import type { User } from "@prisma/client"

export type ActionResponse<T> = {
  success: boolean
  message: string
  errors?: {
    errors: string[]
    properties?: {
      [K in keyof T]?: {
        errors: string[]
      }
    }
  }
  inputs?: Partial<T>
  result?: T
}

export type SuccessResponse = {
  success: boolean
  message: string
  error?: boolean
}

export type UserWithoutPassword = Omit<User, "user_password">
