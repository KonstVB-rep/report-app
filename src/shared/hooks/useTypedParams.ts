"use client";

import { useParams } from "next/navigation";

import z from "zod";

import {
  DepartmentLabelsById,
  DepartmentsUnionIds,
} from "@/entities/department/types";

export const useTypedParams = <T>(schema: z.ZodType<T>): T => {
  const params = useParams();
  return schema.parse(params);
};

export const pageParamsSchemaDepsId = z.object({
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds;
    }),
});

export const pageParamsSchemaDepsIsUserId = z.object({
  userId: z.string(),
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds;
    }),
});
