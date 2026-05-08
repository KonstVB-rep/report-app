"use server"

import {
  type DealFile,
  DealType,
  PermissionEnum,
  Prisma,
  StatusContract,
  StatusProject,
  StatusRetail,
} from "@prisma/client"
import cuid from "cuid"
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { requireUser } from "@/app/api/utils/requireAuth "
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import { toDec, validateRequiredFields } from "@/shared/lib/utils"
import {
  type Contact,
  type DateRange,
  DEAL_TYPE,
  type DealProject,
  type DealRetail,
  type DealsList,
  type DealsListWithResource,
  type ManagerShortInfo,
  type ProjectResponse,
  type ProjectWithManagersIds,
  type ProjectWithoutDateCreateAndUpdate,
  type ProjectWithoutId,
  type ReAssignDeal,
  type RetailResponse,
  type RetailWithManagersIds,
  type RetailWithoutDateCreateAndUpdate,
  type RetailWithoutId,
} from "../types"
import type {
  DealHighlightdeletedType,
  DealHighlightType,
  SerializedManagers,
} from "./../types/index"

const requiredFields = ["nameObject", "direction", "comments", "contact", "dealStatus"]

export interface MutationResponse<U> {
  success: boolean
  data?: U
  error?: string
  code?: number
}

const checkAuthAndDataFill = async (projectData: ProjectWithoutId) => {
  const data = await requireUser()

  validateRequiredFields(projectData, requiredFields)

  return data
}
/********************************************** Получить ****************************************************************/
export const getProjectById = async (
  dealId: string,
): Promise<(DealProject & { managers: ManagerShortInfo[] }) | null> => {
  try {
    const user = await requireUser()

    const { userId } = user

    if (!user) {
      return handleError("Пользователь не найден или у вас нет прав на операцию")
    }

    if (!dealId) {
      handleError("Недостаточно данных")
    }

    const deal = await prisma.project.findUnique({
      where: { id: dealId },
      include: {
        additionalContacts: true,
        projectManagers: {
          include: { user: true },
        },
      },
    })

    if (!deal) {
      return null
    }

    const { projectManagers, ...rest } = deal

    const managers = projectManagers.map((pm) => ({
      id: pm.user.id,
      username: pm.user.username,
      position: pm.user.position,
    }))

    const isExistUserInManagersList = managers.some((man) => man.id === userId)

    const isOwner = userId === deal.userId

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId }, // Фильтруем по dealId
    })

    const formattedProject = {
      ...rest,
      type: DEAL_TYPE.PROJECT,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "", // Преобразуем Decimal в строку
      amountWork: deal.amountWork ? deal.amountWork.toString() : "",
      amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      dealFiles,
      managers,
    }

    return formattedProject
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getRetailById = async (
  dealId: string,
): Promise<(DealRetail & { managers: ManagerShortInfo[] }) | null> => {
  try {
    const user = await requireUser()

    if (!dealId) {
      return handleError("Недостаточно данных")
    }

    const deal = await prisma.retail.findUnique({
      where: { id: dealId },
      include: {
        additionalContacts: true,
        retailManagers: {
          include: { user: true },
        },
      },
    })

    if (!deal) {
      return null
    }

    const { retailManagers, ...rest } = deal

    const managers = retailManagers.map((rm) => ({
      id: rm.user.id,
      username: rm.user.username,
      position: rm.user.position,
    }))

    const isExistUserInManagersList = managers.some((man) => man.id === user.userId)

    const isOwner = user.userId === deal.userId

    if (!user) {
      return handleError("Пользователь не найден или у вас нет прав на операцию")
    }

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId }, // Фильтруем по dealId
    })

    const formattedRetail = {
      ...rest,
      type: DEAL_TYPE.RETAIL,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      dealFiles,
      managers,
    }

    return formattedRetail
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getProjectsUser = async (idDealOwner: string): Promise<ProjectResponse[] | null> => {
  try {
    const user = await requireUser()

    if (!idDealOwner) {
      return handleError("Недостаточно данных")
    }

    const isOwner = user.userId === idDealOwner
    if (!isOwner) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const deals = await prisma.project.findMany({
      where: {
        projectManagers: {
          some: {
            userId: idDealOwner,
          },
        },
      },
      orderBy: {
        dateRequest: "asc",
      },
      include: {
        additionalContacts: true,
        projectManagers: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                position: true,
              },
            },
          },
        },
        highlights: {
          where: { userId: user.userId },
        },
      },
    })

    return deals.length
      ? deals.map((deal) => {
          const appliedColor =
            deal.highlights && deal.highlights.length > 0 ? deal.highlights[0].color : null

          const serializedManagers: SerializedManagers =
            deal.projectManagers?.map((pm: { user: ManagerShortInfo }) => pm.user) ?? []

          const { projectManagers, ...restDeal } = deal

          return {
            ...restDeal,
            amountCP: deal.amountCP?.toString() || "",
            amountWork: deal.amountWork?.toString() || "",
            amountPurchase: deal.amountPurchase?.toString() || "",
            delta: deal.delta?.toString() || "",
            managers: serializedManagers,
            highlights: appliedColor,
          }
        })
      : []
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getContractsUser = async (idDealOwner: string): Promise<ProjectResponse[] | null> => {
  try {
    const user = await requireUser()

    if (!idDealOwner) {
      return handleError("Недостаточно данных")
    }

    const isOwner = user.userId === idDealOwner
    if (!isOwner) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const statuses = Object.keys(StatusContract) as Array<keyof typeof StatusContract>

    const deals = await prisma.project.findMany({
      where: {
        projectManagers: {
          some: {
            userId: idDealOwner,
          },
        },
        dealStatus: {
          in: statuses,
        },
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    return deals.length
      ? deals.map((deal) => {
          const { amountCP, amountWork, amountPurchase, delta, ...restDeal } = deal
          return {
            ...restDeal,
            amountCP: amountCP?.toString() || "",
            amountWork: amountWork?.toString() || "",
            amountPurchase: amountPurchase?.toString() || "",
            delta: delta?.toString() || "",
          }
        })
      : []
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getRetailsUser = async (idDealOwner: string): Promise<RetailResponse[] | null> => {
  try {
    const user = await requireUser()

    if (!idDealOwner) {
      return handleError("Недостаточно данных")
    }

    const isOwner = user.userId === idDealOwner

    if (!isOwner) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const deals = await prisma.retail.findMany({
      where: {
        retailManagers: {
          some: {
            userId: idDealOwner,
          },
        },
      },
      orderBy: {
        dateRequest: "asc",
      },
      include: {
        additionalContacts: true,
        retailManagers: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                position: true,
              },
            },
          },
        },
        highlights: {
          where: { userId: user.userId },
        },
      },
    })

    return deals.map((deal) => {
      const appliedColor =
        deal.highlights && deal.highlights.length > 0 ? deal.highlights[0].color : null

      const serializedManagers: SerializedManagers =
        deal.retailManagers?.map((pm: { user: ManagerShortInfo }) => pm.user) ?? []

      const { retailManagers, ...restDeal } = deal

      return {
        ...restDeal,
        amountCP: deal.amountCP ? deal.amountCP.toString() : "",
        delta: deal.delta ? deal.delta.toString() : "",
        managers: serializedManagers,
        highlights: appliedColor,
      }
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getAllProjectsByDepartment = async (
  departmentId?: number | undefined,
): Promise<ProjectResponse[]> => {
  try {
    const user = await requireUser()

    await checkUserPermissionByRole(user, [PermissionEnum.VIEW_UNION_REPORT])

    const departmentIdValue = departmentId !== undefined ? departmentId : user.departmentId

    const deals = await prisma.project.findMany({
      where: {
        user: {
          departmentId: departmentIdValue,
        },
      },
      include: {
        projectManagers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                position: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    return deals.map((deal) => {
      const managers: ManagerShortInfo[] = deal.projectManagers.map((pm) => ({
        id: pm.userId,
        username: pm.user?.username || "",
        position: pm.user?.position || "",
      }))

      const { projectManagers, ...restDeal } = deal

      return {
        ...restDeal,
        user: deal.user?.username || "Нет менеджера",

        amountCP: deal.amountCP ? deal.amountCP.toString() : "",
        amountWork: deal.amountWork ? deal.amountWork.toString() : "",
        amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
        delta: deal.delta ? deal.delta.toString() : "",
        managers,
      }
    })
  } catch (error) {
    console.log(error)
    return handleError((error as Error).message)
  }
}

export const getAllRetailsByDepartment = async (
  departmentId: number,
): Promise<RetailResponse[]> => {
  try {
    const user = await requireUser()

    await checkUserPermissionByRole(user, [PermissionEnum.VIEW_UNION_REPORT])

    const departmentIdValue = departmentId !== undefined ? departmentId : user.departmentId

    const deals = await prisma.retail.findMany({
      where: {
        user: {
          departmentId: departmentIdValue,
        },
      },
      include: {
        retailManagers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                position: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    return deals.map((deal) => {
      const managers: ManagerShortInfo[] = deal.retailManagers.map((pm) => ({
        id: pm.userId,
        username: pm.user?.username || "",
        position: pm.user?.position || "",
      }))

      const { retailManagers, ...restDeal } = deal

      return {
        ...restDeal,
        user: deal.user?.username || "Нет менеджера",
        amountCP: deal.amountCP ? deal.amountCP.toString() : "",
        delta: deal.delta ? deal.delta.toString() : "",
        managers,
      }
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getAllDealsRequestSourceByDepartment = async (
  departmentId: number,
): Promise<DealsListWithResource> => {
  try {
    await requireUser()

    const retailsRequestResorce = await prisma.retail.findMany({
      where: {
        user: {
          departmentId,
        },
      },
      select: {
        dateRequest: true,
        resource: true,
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    const projectsRequestResource = await prisma.project.findMany({
      where: {
        user: {
          departmentId,
        },
      },
      select: {
        dateRequest: true,
        resource: true,
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    const allDeals = [...retailsRequestResorce, ...projectsRequestResource]

    const totalDealsCount = allDeals.length || 0

    return { deals: allDeals, totalDealsCount } as DealsListWithResource
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getAllDealsByDepartment = async (departmentId: number): Promise<DealsList> => {
  try {
    await requireUser()

    const retailsRequestResorce = await prisma.retail.findMany({
      where: {
        user: {
          departmentId,
        },
      },
      select: {
        id: true,
        dateRequest: true,
        nameDeal: true,
        nameObject: true,
        comments: true,
        userId: true,
        type: true,
        dealStatus: true,
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    const projectsRequestResource = await prisma.project.findMany({
      where: {
        user: {
          departmentId,
        },
      },
      select: {
        id: true,
        dateRequest: true,
        nameDeal: true,
        nameObject: true,
        comments: true,
        userId: true,
        type: true,
        dealStatus: true,
      },
      orderBy: {
        dateRequest: "asc",
      },
    })

    const allDeals = [...retailsRequestResorce, ...projectsRequestResource]

    const totalDealsCount = allDeals.length || 0

    return { deals: allDeals, totalDealsCount } as DealsList
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getDealsByDateRange = async (
  idDealOwner: string,
  range: DateRange,
  departmentId: number,
) => {
  const user = await requireUser()

  if (!idDealOwner) {
    handleError("Недостаточно данных")
  }

  const isOwner = user.userId === idDealOwner

  if (!isOwner) {
    await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
  }

  const now = new Date()
  now.setHours(23, 59, 59, 999)

  let startDate: Date

  switch (range) {
    case "week":
      startDate = new Date()
      startDate.setDate(now.getDate() - 7)
      break

    case "month":
      startDate = new Date()
      startDate.setMonth(now.getMonth() - 1)
      break

    case "threeMonths":
      startDate = new Date()
      startDate.setMonth(now.getMonth() - 3)
      break

    case "halfYear":
      startDate = new Date()
      startDate.setMonth(now.getMonth() - 6)
      break

    case "year":
      startDate = new Date()
      startDate.setFullYear(now.getFullYear() - 1)
      break

    default:
      throw new Error("Некорректный диапазон дат")
  }

  startDate.setHours(0, 0, 0, 0)

  const dealsP = (await prisma.project.findMany({
    where: {
      dateRequest: {
        gte: startDate,
        lte: now,
      },
      projectManagers: {
        some: {
          userId: idDealOwner,
          user: {
            departmentId,
          },
        },
      },
    },
    orderBy: {
      dateRequest: "asc",
    },
  })) as unknown as ProjectResponse[]

  const dealsR = (await prisma.retail.findMany({
    where: {
      dateRequest: {
        gte: startDate,
        lte: now,
      },
      retailManagers: {
        some: {
          userId: idDealOwner,
          user: {
            departmentId,
          },
        },
      },
    },
    orderBy: {
      dateRequest: "asc",
    },
  })) as unknown as RetailResponse[]

  const paidDealsP = dealsP.filter((item) => item.dealStatus === "PAID")
  const closedDealsP = dealsP.filter((item) => item.dealStatus === "CLOSED")
  const rejectDealsP = dealsP.filter((item) => item.dealStatus === "REJECT")
  const paidDealsR = dealsR.filter((item) => item.dealStatus === "PAID")
  const closedDealsR = dealsR.filter((item) => item.dealStatus === "CLOSED")
  const rejectDealsR = dealsR.filter((item) => item.dealStatus === "REJECT")
  const dealPwithMoney = dealsP.filter(
    (item) => item.dealStatus === "CLOSED" || item.dealStatus === "PAID",
  )
  const dealRwithMoney = dealsR.filter(
    (item) => item.dealStatus === "CLOSED" || item.dealStatus === "PAID",
  )

  const commercialOfferAmountsP = dealPwithMoney.reduce(
    (acc, item) => {
      acc.sumCp += Number(item.amountCP)
      acc.sumDelta += Number(item.delta)
      return acc
    },
    { sumCp: 0, sumDelta: 0 },
  )
  const commercialOfferAmountsR = dealRwithMoney.reduce(
    (acc, item) => {
      acc.sumCp += Number(item.amountCP)
      acc.sumDelta += Number(item.delta)
      return acc
    },
    { sumCp: 0, sumDelta: 0 },
  )

  return {
    projects: {
      length: dealsP.length,
      reject: rejectDealsP.length,
      paid: paidDealsP.length,
      closed: closedDealsP.length,
      money: commercialOfferAmountsP,
    },
    retails: {
      length: dealsR.length,
      reject: rejectDealsR.length,
      paid: paidDealsR.length,
      closed: closedDealsR.length,
      money: commercialOfferAmountsR,
    },
  }
}

/******************************************Создать *********************************************************/

export const createProject = async (
  data: ProjectWithoutId & { managersIds: { userId: string }[] },
): Promise<ProjectResponse> => {
  try {
    if (!data) return handleError("Ошибка: данные не переданы")
    if (data.dealStatus !== StatusProject.REQUEST) {
      await checkAuthAndDataFill(data)
    } else {
      await requireUser()
    }

    const {
      amountCP,
      amountPurchase,
      amountWork,
      delta,
      contacts,
      managersIds,
      highlights,
      ...dealData
    } = data

    const idDeal = (dealData.id as string) || cuid()
    const safeAmountCP = new Prisma.Decimal(amountCP as string)
    const safeDelta = new Prisma.Decimal(delta as string)
    const safeAmountWork = new Prisma.Decimal(amountWork as string)
    const safeAmountPurchase = new Prisma.Decimal(amountPurchase as string)

    const newDeal = await prisma.project.create({
      data: {
        ...(dealData as ProjectResponse),
        id: idDeal,
        userId: data.userId as string,
        amountCP: safeAmountCP,
        delta: safeDelta,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,
        highlights: undefined,
        additionalContacts: {
          create: (contacts as Contact[]).map((contact) => ({
            name: contact.name ?? "",
            phone: contact.phone ?? null,
            email: contact.email ?? null,
            position: contact.position ?? null,
          })),
        },
        projectManagers: {
          create: managersIds.map((manager) => ({
            user: { connect: { id: manager.userId } },
          })),
        },
      },
    })

    return {
      ...newDeal,
      amountCP: newDeal.amountCP?.toString() ?? "0",
      amountWork: newDeal.amountWork?.toString() ?? "0",
      amountPurchase: newDeal.amountPurchase?.toString() ?? "0",
      delta: newDeal.delta?.toString() ?? "0",
    } as unknown as ProjectResponse
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const createRetail = async (
  data: RetailWithoutId & { managersIds: { userId: string }[] },
) => {
  try {
    if (!data) return handleError("Ошибка: данные не переданы")
    console.log(data.dealStatus, StatusRetail.REQUEST, "**************************")
    if (data.dealStatus !== StatusRetail.REQUEST) {
      await checkAuthAndDataFill(data)
    } else {
      await requireUser()
    }

    console.log("**************************")

    const { amountCP, delta, contacts, managersIds, highlight, ...dealData } = data

    const idDeal = (dealData.id as string) || cuid()

    const newDeal = await prisma.retail.create({
      data: {
        ...(dealData as RetailResponse),
        id: idDeal,
        userId: data.userId as string,
        amountCP: new Prisma.Decimal((amountCP as string) || "0"),
        delta: new Prisma.Decimal((delta as string) || "0"),
        highlights: undefined,
        additionalContacts: {
          create: (contacts as Contact[]).map((contact) => ({
            name: contact.name ?? "",
            phone: contact.phone ?? null,
            email: contact.email ?? null,
            position: contact.position ?? null,
          })),
        },
        retailManagers: {
          create: managersIds.map((manager) => ({
            user: { connect: { id: manager.userId } },
          })),
        },
      },
    })

    return {
      ...newDeal,
      amountCP: newDeal.amountCP?.toString() ?? "0",
      delta: newDeal.delta?.toString() ?? "0",
    } as unknown as RetailResponse
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

/********************************************************* Обновить проект ********************************************/

export const updateProject = async (
  data: ProjectWithManagersIds,
): Promise<MutationResponse<ProjectWithoutDateCreateAndUpdate | null>> => {
  try {
    const user = await requireUser()
    const { userId } = user

    const id = data.id as string
    if (!id) return { success: false, error: "ID обязателен", code: 400 }

    const { amountCP, amountPurchase, amountWork, delta, contacts, managersIds, ...dealData } = data

    const deal = await prisma.project.findUnique({
      where: { id },
      include: { projectManagers: { select: { userId: true } } },
    })

    if (!deal) return { success: false, error: "Не найден", code: 404 }

    const isManager = deal.projectManagers.some((pm) => pm.userId === userId)
    const isNewManager = managersIds.some((m) => m.userId === userId)

    if (userId !== deal.userId && !isManager && !isNewManager) {
      await checkUserPermissionByRole(user, [PermissionEnum.DEAL_MANAGEMENT])
    }

    const finalDeal = await prisma.$transaction(async (tx) => {
      await tx.projectManager.deleteMany({ where: { dealId: id } })
      if (managersIds.length > 0) {
        await tx.projectManager.createMany({
          data: managersIds.map((m) => ({
            dealId: id,
            userId: m.userId as string,
          })),
        })
      }

      // 2. СИНХРОНИЗАЦИЯ КОНТАКТОВ (Чистый подход)
      // Сначала отключаем текущие контакты от этого проекта
      await tx.project.update({
        where: { id },
        data: { additionalContacts: { set: [] } },
      })

      const updatedProject = await tx.project.update({
        where: { id },
        data: {
          ...dealData,
          amountCP: toDec(amountCP),
          amountPurchase: toDec(amountPurchase),
          amountWork: toDec(amountWork),
          delta: toDec(delta),
          additionalContacts: {
            create: ((contacts as Contact[]) || []).map((c) => ({
              name: c.name ?? "",
              phone: c.phone,
              email: c.email,
            })),
          },
        },
        include: {
          projectManagers: {
            include: {
              user: { select: { id: true, username: true, position: true } },
            },
          },
        },
      })

      return updatedProject
    })

    const { createdAt, updatedAt, projectManagers, ...rest } = finalDeal

    return {
      success: true,
      data: {
        ...rest,
        amountCP: finalDeal.amountCP?.toString() ?? "0",
        amountWork: finalDeal.amountWork?.toString() ?? "0",
        amountPurchase: finalDeal.amountPurchase?.toString() ?? "0",
        delta: finalDeal.delta?.toString() ?? "0",
        managers: projectManagers.map((pm) => ({
          id: pm.user.id,
          managerName: pm.user.username,
          position: pm.user.position,
        })),
      } as unknown as ProjectWithoutDateCreateAndUpdate,
    }
  } catch (error: unknown) {
    console.error(error)
    const msg = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: msg, code: 500 }
  }
}

export const updateRetail = async (
  data: RetailWithManagersIds,
): Promise<MutationResponse<RetailWithoutDateCreateAndUpdate | null>> => {
  try {
    const user = await requireUser()
    const { userId } = user

    const retailId = data.id as string
    if (!retailId) return { success: false, error: "ID розницы обязателен", code: 400 }

    const { amountCP, delta, contacts, managersIds, ...dealData } = data

    const deal = await prisma.retail.findUnique({
      where: { id: retailId },
      include: { retailManagers: { select: { userId: true } } },
    })

    if (!deal) return { success: false, error: "Розница не найдена", code: 404 }

    const isManager = deal.retailManagers.some((rm) => rm.userId === userId)
    const isNewManager = managersIds.some((m) => m.userId === userId)
    const isOwner = deal.userId === userId || isNewManager

    if (!isOwner && !isManager) {
      await checkUserPermissionByRole(user, [PermissionEnum.DEAL_MANAGEMENT])
    }

    const finalDeal = await prisma.$transaction(async (tx) => {
      await tx.retailManager.deleteMany({ where: { dealId: retailId } })
      if (Array.isArray(managersIds) && managersIds.length > 0) {
        await tx.retailManager.createMany({
          data: managersIds.map((m) => ({
            dealId: retailId,
            userId: m.userId as string,
          })),
        })
      }

      await tx.retail.update({
        where: { id: retailId },
        data: { additionalContacts: { set: [] } },
      })

      const updatedRetail = await tx.retail.update({
        where: { id: retailId },
        data: {
          ...dealData,
          amountCP: toDec(amountCP),
          delta: toDec(delta),
          additionalContacts: {
            create: ((contacts as Contact[]) || []).map((c) => ({
              name: c.name ?? "",
              phone: c.phone,
              email: c.email,
              position: c.position,
            })),
          },
        },
        include: {
          additionalContacts: true,
          retailManagers: {
            include: {
              user: { select: { id: true, username: true, position: true } },
            },
          },
        },
      })

      return updatedRetail
    })

    const managers = finalDeal.retailManagers.map((rm) => ({
      id: rm.user.id,
      managerName: rm.user.username,
      position: rm.user.position,
    }))

    const { createdAt, updatedAt, retailManagers, ...rest } = finalDeal

    return {
      success: true,
      data: {
        ...rest,
        amountCP: finalDeal.amountCP?.toString() ?? "0",
        delta: finalDeal.delta?.toString() ?? "0",
        managers,
      } as unknown as RetailWithoutDateCreateAndUpdate,
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    console.error("[UpdateRetail Error]:", msg)

    if (msg === "UNAUTHORIZED") return { success: false, error: "Сессия истекла", code: 401 }
    return { success: false, error: msg, code: 500 }
  }
}

/******************************************************* Удалить проект *********************************************/

export const deleteDeal = async (dealId: string, type: DealType) => {
  try {
    const user = await requireUser()
    const isProject = type === DealType.PROJECT

    const deal = isProject
      ? await prisma.project.findUnique({
          where: { id: dealId },
          include: { additionalContacts: { select: { id: true } } },
        })
      : await prisma.retail.findUnique({
          where: { id: dealId },
          include: { additionalContacts: { select: { id: true } } },
        })

    if (!deal) return { success: false, error: "Сделка не найдена", code: 404 }

    await checkUserPermissionByRole(user, [PermissionEnum.DEAL_DELETE])

    const contactIds = deal.additionalContacts.map((c) => c.id)
    let managers: { dealId: string; userId: string }[] = []

    await prisma.$transaction(async (tx) => {
      managers = isProject
        ? await tx.projectManager.findMany({ where: { dealId } })
        : await tx.retailManager.findMany({ where: { dealId } })

      if (isProject) {
        await tx.projectManager.deleteMany({ where: { dealId } })
      } else {
        await tx.retailManager.deleteMany({ where: { dealId } })
      }

      await tx.dealFile.deleteMany({ where: { dealId, dealType: type } })

      if (isProject) {
        await tx.project.delete({ where: { id: dealId } })
      } else {
        await tx.retail.delete({ where: { id: dealId } })
      }

      if (contactIds.length > 0) {
        await tx.additionalContact.deleteMany({
          where: {
            id: { in: contactIds },
            projects: { none: {} },
            retails: { none: {} },
          },
        })
      }
    })

    return {
      success: true,
      data: { managers },
      message: "Удалено успешно",
      error: false,
    }
  } catch (error: unknown) {
    console.error(error)
    const msg = error instanceof Error ? error.message : "Unknown error"
    return { success: false, error: msg, code: 500, message: msg }
  }
}

export const deleteMultipleDeals = async (
  dealIds: { id: string; type: DealType }[],
): Promise<{
  success: boolean
  deletedCount: number
  files: DealFile[]
  message: string
  error: boolean
}> => {
  try {
    const user = await requireUser()

    if (user.role !== "ADMIN") {
      return {
        success: false,
        deletedCount: 0,
        files: [],
        message: "Нет прав для массового удаления",
        error: true,
      }
    }

    const projectsIds = dealIds.filter((d) => d.type === DealType.PROJECT).map((p) => p.id)
    const retailsIds = dealIds.filter((d) => d.type === DealType.RETAIL).map((r) => r.id)
    const allIds = [...projectsIds, ...retailsIds]

    const [projects, retails, , files] = await Promise.all([
      projectsIds.length
        ? prisma.project.findMany({
            where: { id: { in: projectsIds } },
            include: { additionalContacts: { select: { id: true } } },
          })
        : [],
      retailsIds.length
        ? prisma.retail.findMany({
            where: { id: { in: retailsIds } },
            include: { additionalContacts: { select: { id: true } } },
          })
        : [],
      // Менеджеры
      Promise.all([
        projectsIds.length
          ? prisma.projectManager.findMany({
              where: { dealId: { in: projectsIds } },
            })
          : [],
        retailsIds.length
          ? prisma.retailManager.findMany({
              where: { dealId: { in: retailsIds } },
            })
          : [],
      ]),
      // Файлы
      prisma.dealFile.findMany({ where: { dealId: { in: allIds } } }),
    ])

    const contactIds = [
      ...new Set([...projects, ...retails].flatMap((d) => d.additionalContacts.map((c) => c.id))),
    ]

    // 3. Атомарная транзакция
    await prisma.$transaction(async (tx) => {
      // PROJECTS
      if (projectsIds.length) {
        await tx.projectManager.deleteMany({
          where: { dealId: { in: projectsIds } },
        })
        await tx.project.deleteMany({ where: { id: { in: projectsIds } } })
      }

      // RETAILS
      if (retailsIds.length) {
        await tx.retailManager.deleteMany({
          where: { dealId: { in: retailsIds } },
        })
        await tx.retail.deleteMany({ where: { id: { in: retailsIds } } })
      }

      await tx.dealFile.deleteMany({ where: { dealId: { in: allIds } } })

      if (contactIds.length) {
        await tx.additionalContact.deleteMany({
          where: {
            id: { in: contactIds },
            projects: { none: {} },
            retails: { none: {} },
          },
        })
      }
    })

    return {
      success: true,
      deletedCount: projects.length + retails.length,
      files: files,
      message: "Сделки и связанные данные успешно удалены",
      error: false,
    }
  } catch (error) {
    console.error("Delete Multiple Deals Error:", error)
    return {
      success: false,
      deletedCount: 0,
      files: [],
      message: (error as Error).message,
      error: true,
    }
  }
}

export const getAdditionalContacts = async (dealId: string) => {
  try {
    await requireUser()

    if (!dealId) {
      return handleError("ID сделки обязателен")
    }

    const contacts = await prisma.additionalContact.findMany({
      where: {
        OR: [{ projects: { some: { id: dealId } } }, { retails: { some: { id: dealId } } }],
      },
      orderBy: {
        name: "asc",
      },
    })

    return contacts
  } catch (error) {
    console.error(`[DB_ERROR] dealId: ${dealId}`, error)
    return handleError("Не удалось загрузить контакты. Попробуйте позже.")
  }
}

export const reassignDealsToManager = async (
  data: ReAssignDeal,
): Promise<{
  success: boolean
  message: string
  error: boolean
}> => {
  try {
    const user = await requireUser()
    if (user.role !== "ADMIN") {
      return {
        success: false,
        message: "Только администратор может массово переназначать сделки",
        error: true,
      }
    }

    const { dealIds, newManagerId } = data
    const projectIds = dealIds.filter((d) => d.type === DealType.PROJECT).map((d) => d.id)
    const retailIds = dealIds.filter((d) => d.type === DealType.RETAIL).map((d) => d.id)
    const allIds = dealIds.map((d) => d.id)

    await prisma.$transaction(async (tx) => {
      if (projectIds.length > 0) {
        await tx.projectManager.deleteMany({
          where: { dealId: { in: projectIds } },
        })
        await tx.projectManager.createMany({
          data: projectIds.map((id) => ({ dealId: id, userId: newManagerId })),
          skipDuplicates: true,
        })

        await tx.project.updateMany({
          where: { id: { in: projectIds } },
          data: { userId: newManagerId },
        })
      }

      if (retailIds.length > 0) {
        await tx.retailManager.deleteMany({
          where: { dealId: { in: retailIds } },
        })
        await tx.retailManager.createMany({
          data: retailIds.map((id) => ({ dealId: id, userId: newManagerId })),
          skipDuplicates: true,
        })

        await tx.retail.updateMany({
          where: { id: { in: retailIds } },
          data: { userId: newManagerId },
        })
      }

      if (allIds.length > 0) {
        await tx.dealFile.updateMany({
          where: { dealId: { in: allIds } },
          data: { userId: newManagerId },
        })
      }
    })

    return {
      success: true,
      message: `Успешно переназначено сделок: ${allIds.length}`,
      error: false,
    }
  } catch (error) {
    console.error("[Reassign Error]:", error)
    const msg = error instanceof Error ? error.message : "Ошибка переназначения"
    return { success: false, message: msg, error: true }
  }
}

export async function setHighlight(higlightData: DealHighlightType) {
  try {
    const user = await requireUser()
    const { id, type, color, userId: ownerDealId } = higlightData
    const userId = user.userId

    if (!color) return

    const selector =
      type === DEAL_TYPE.PROJECT
        ? { userId_projectId: { userId, projectId: id } }
        : { userId_retailId: { userId, retailId: id } }

    const data =
      type === DEAL_TYPE.PROJECT
        ? { userId, projectId: id, color }
        : { userId, retailId: id, color }

    await prisma.userHighlight.upsert({
      where: selector,
      update: { color },
      create: data,
    })

    return { type, userId: ownerDealId }
  } catch (error) {
    console.error("[setHighlight Error]:", error)
  }
}

export const getHilightList = async () => {
  try {
    const { userId } = await requireUser()

    const colors = await prisma.userHighlight.findMany({
      where: { userId },
    })

    return colors
  } catch (error) {
    handleError((error as Error).message)
    return []
  }
}

export const deleteHighlight = async (higlightData: DealHighlightdeletedType) => {
  try {
    const user = await requireUser()
    const { type, color, userId: ownerDealId, all } = higlightData
    const userId = user.userId

    //     if (id && !all && !color) {
    //   await prisma.userHighlight.deleteMany({
    //     where: type === DEAL_TYPE.PROJECT
    //         ? { userId, projectId: id }
    //         : { userId, retailId: id },
    //   });
    //   return { type, userId: ownerDealId };
    // }

    const typeDeal = type === DEAL_TYPE.PROJECT ? "projectId" : "retailId"

    if (all) {
      await prisma.userHighlight.deleteMany({
        where: {
          userId,
          [typeDeal]: { not: null },
        },
      })
      return { type, userId: ownerDealId }
    }

    if (color) {
      await prisma.userHighlight.deleteMany({
        where: {
          userId,
          color,
          [typeDeal]: { not: null },
        },
      })
      return { type, userId: ownerDealId }
    }
  } catch (error) {
    console.error("[deleteHighlight Error]:", error)
    handleError((error as Error).message)
  }
}
