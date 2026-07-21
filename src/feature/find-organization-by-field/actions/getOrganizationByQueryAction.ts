"use server"

import { prisma } from "@/prisma/prisma-client"
import type { CompanySuggestionItem, FoundCompanySuggestion } from "../api/useFindOrganization"
import { SearchType } from "../model/schema"

export async function getOrganizationByQueryAction(
  query: string,
  searchType: SearchType,
): Promise<{
  success: boolean
  data: FoundCompanySuggestion
  error: string | null
}> {
  try {
    const searchTrim = query.trim()
    if (!searchTrim) return { success: true, data: null, error: null }

    let whereCondition: any = {}

    switch (searchType) {
      case "inn":
        whereCondition = { inn: { contains: searchTrim } }
        break

      case "orgName":
        whereCondition = {
          OR: [{ nameDeal: { contains: searchTrim } }, { nameObject: { contains: searchTrim } }],
        }
        break

      case "phone":
        whereCondition = {
          OR: [
            { phone: { contains: searchTrim } },
            {
              additionalContacts: {
                some: { phone: { contains: searchTrim } },
              },
            },
          ],
        }
        break

      case "email":
        whereCondition = {
          OR: [
            { email: { contains: searchTrim } },
            {
              additionalContacts: {
                some: { email: { contains: searchTrim } },
              },
            },
          ],
        }
        break

      default:
        return { success: false, data: null, error: "Неверный тип поиска" }
    }

    // 1. Запрос в таблицу Проектов
    const projects = await prisma.project.findMany({
      where: whereCondition,
      take: 10,
      include: {
        user: {
          select: { id: true, username: true, position: true, email: true },
        },
        additionalContacts: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            position: true,
          },
        },
      },
    })

    const retails = await prisma.retail.findMany({
      where: whereCondition,
      take: 10,
      include: {
        user: {
          select: { id: true, username: true, position: true, email: true },
        },
        additionalContacts: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            position: true,
          },
        },
      },
    })

    const formattedProjects: CompanySuggestionItem[] = projects.map((p) => ({
      id: p.id,
      inn: p.inn,
      nameDeal: p.nameDeal,
      nameObject: p.nameObject,
      type: "PROJECT",
      phone: p.phone,
      email: p.email,
      contact: p.contact,
      additionalContacts: p.additionalContacts,
      mainManager: p.user
        ? {
            username: p.user.username,
            position: p.user.position,
          }
        : null,
    }))

    const formattedRetails: CompanySuggestionItem[] = retails.map((r) => ({
      id: r.id,
      inn: r.inn,
      nameDeal: r.nameDeal,
      nameObject: r.nameObject,
      type: "RETAIL",
      phone: r.phone,
      email: r.email,
      contact: r.contact,
      additionalContacts: r.additionalContacts,
      mainManager: r.user
        ? {
            username: r.user.username,
            position: r.user.position,
          }
        : null,
    }))

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
