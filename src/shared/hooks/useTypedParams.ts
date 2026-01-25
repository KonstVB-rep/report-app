"use client"

import { useParams } from "next/navigation"
import z from "zod"
import type { DepartmentsUnionIds } from "@/entities/department/types"

export const useTypedParams = <T>(schema: z.ZodType<T>): T | null => {
  const params = useParams()
  const result = schema.safeParse(params)

  if (!result.success) {
    console.warn("Params validation failed", result.error)
    return null
  }

  return result.data
}

export const pageParamsSchemaDepsId = z.object({
  departmentId: z.preprocess((v) => {
    if (typeof v === "string" && v.startsWith("%%")) return undefined
    const n = Number(v)
    return Number.isNaN(n) ? undefined : n
  }, z.number()),
})

export const pageParamsSchemaDepsIsUserId = z.object({
  userId: z.string(),
  departmentId: z.preprocess((v) => {
    if (typeof v === "string" && (v.startsWith("%%") || Number.isNaN(Number(v)))) {
      return 0
    }
    return Number(v)
  }, z.number().positive()),
})
