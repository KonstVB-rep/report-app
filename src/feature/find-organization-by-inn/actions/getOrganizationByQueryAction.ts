"use server"

import { prisma } from "@/prisma/prisma-client" // Твой Prisma инстанс
import type { CompanySuggestionItem, FoundCompanySuggestion } from "../api/useFindOrganization"

export async function getOrganizationByQueryAction(
  query: string,
  searchType: "inn" | "orgName",
): Promise<{
  success: boolean
  data: FoundCompanySuggestion
  error: string | null
}> {
  try {
    const searchTrim = query.trim()
    if (!searchTrim) return { success: true, data: null, error: null }

    const whereCondition =
      searchType === "inn"
        ? { inn: { contains: searchTrim } }
        : {
            OR: [
              {
                nameDeal: {
                  contains: searchTrim,
                },
              },
              {
                nameObject: {
                  contains: searchTrim,
                },
              },
            ],
          }

    // 1. Ищем в таблице Проектов
    const projects = await prisma.project.findMany({
      where: whereCondition,
      take: 10,
      include: {
        user: {
          select: { id: true, username: true, position: true, email: true },
        },
      },
    })

    // 2. Ищем в таблице Розничных продаж
    const retails = await prisma.retail.findMany({
      where: whereCondition,
      take: 10,
      include: {
        user: {
          select: { id: true, username: true, position: true, email: true },
        },
      },
    })

    // 3. Маппим проекты в единую структуру
    const formattedProjects: CompanySuggestionItem[] = projects.map((p) => ({
      id: p.id,
      inn: p.inn,
      nameDeal: p.nameDeal,
      nameObject: p.nameObject,
      type: "PROJECT",
      mainManager: p.user
        ? {
            username: p.user.username,
            position: p.user.position,
          }
        : null,
    }))

    // 4. Маппим розницу в единую структуру
    const formattedRetails: CompanySuggestionItem[] = retails.map((r) => ({
      id: r.id,
      inn: r.inn,
      nameDeal: r.nameDeal,
      nameObject: r.nameObject,
      type: "RETAIL",
      mainManager: r.user
        ? {
            username: r.user.username,
            position: r.user.position,
          }
        : null,
    }))

    // Объединяем результаты поиска
    return {
      success: true,
      data: {
        projects: formattedProjects,
        retails: formattedRetails,
      },
      error: null,
    }
  } catch (error) {
    console.error("Ошибка при поиске организации в БД:", error)
    return {
      success: false,
      data: null,
      error: "Внутренняя ошибка сервера при чтении CRM",
    }
  }
}
