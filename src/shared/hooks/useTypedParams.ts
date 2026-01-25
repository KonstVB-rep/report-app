"use client"

import { useParams } from "next/navigation"
import z from "zod"
import type { DepartmentsUnionIds } from "@/entities/department/types"

export const useTypedParams = <T>(schema: z.ZodType<T>): T => {
  const params = useParams()
  const result = schema.safeParse(params)

  if (!result.success) {
    return {} as T
  }

  return result.data
}
const coerceNumber = z.preprocess((val) => {
  if (!val || val === "undefined") return undefined
  const parsed = Number(val)
  return Number.isNaN(parsed) ? undefined : parsed
}, z.number().positive().optional())

export const pageParamsSchemaDepsId = z.object({
  departmentId: coerceNumber.transform((val) => val as DepartmentsUnionIds),
})

export const pageParamsSchemaDepsIsUserId = z.object({
  userId: z.string(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds
    }),
})
