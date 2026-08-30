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

export type ModalType = "edit" | "delete" | "more" | "color" | null

export const REFETCH_INTERVAL = 1000 * 60 * 5

export const REFETCH_INTERVAL_SUMMARY_TABLE = 1000 * 60

export const ERROR_TEXT = "Не удалось получить список объектов"
