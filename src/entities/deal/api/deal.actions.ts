"use server"

import {
  type DealFile,
  DealType,
  PermissionEnum,
  Prisma,
  StatusProject,
  StatusRetail,
} from "@prisma/client"
import cuid from "cuid"
import { updateTag } from "next/cache"
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { requireUser } from "@/app/api/utils/requireAuth"
import {
  getCachedAdditionalContacts,
  getCachedAllDealsByDepartment,
  getCachedAllDealsRequestSourceByDepartment,
  getCachedAllProjectsByDepartment,
  getCachedAllRetailsByDepartment,
  getCachedContractsUser,
  getCachedProjectUser,
  getCachedRetailsUser,
  tagKeysDealActions,
} from "@/entities/deal/api/cachedQueryDealDb"
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
  type ProjectWithoutDateCreateAndUpdate,
  type ReAssignDeal,
  type RetailResponse,
  type RetailWithoutDateCreateAndUpdate,
} from "../types"
import type {
  DealHighlightdeletedType,
  DealHighlightType,
  MutationResponse,
  ProjectReq,
  RetailReq,
} from "./../types/index"

const requiredFields = ["direction", "comments", "contact", "dealStatus"] as const

// ==========================================
// ОБЩИЕ ТИПЫ
// ==========================================

type PrismaManagerWithUser = {
  user: { id: string; username: string; position: string }
}

// ==========================================
// ОБЩИЕ ФУНКЦИИ
// ==========================================

const checkAuthAndDataFill = async (projectData: ProjectReq | RetailReq) => {
  const data = await requireUser()
  validateRequiredFields(projectData, requiredFields)
  return data
}

const getTargetDepartmentId = async (
  userDepartmentId: number,
  dealUserId: string | null,
): Promise<number> => {
  if (!dealUserId) return userDepartmentId

  const dealOwnerData = await prisma.user.findUnique({
    where: { id: dealUserId },
    select: { departmentId: true },
  })

  return dealOwnerData?.departmentId ?? userDepartmentId
}

const toDecimalString = (value: Prisma.Decimal | null | undefined): string =>
  value?.toString() ?? ""

const formatManagers = (managers: PrismaManagerWithUser[]): ManagerShortInfo[] =>
  managers.map((pm) => ({
    id: pm.user.id,
    username: pm.user.username,
    position: pm.user.position,
  }))

const updateManagerTags = (managers: { userId: string }[], type: "project" | "retail") => {
  const tagFn =
    type === "project" ? tagKeysDealActions.projectsUser : tagKeysDealActions.retailsUser

  for (const manager of managers) {
    updateTag(tagFn(manager.userId))
  }
}

const updateDepartmentTags = (departmentId: number, type: "project" | "retail" | "all") => {
  if (type === "project" || type === "all") {
    updateTag(tagKeysDealActions.allProjectsDep(departmentId))
  }
  if (type === "retail" || type === "all") {
    updateTag(tagKeysDealActions.allRetailsDep(departmentId))
  }
  updateTag(tagKeysDealActions.allDealsDep(departmentId))
}

/********************************************** Получить ****************************************************************/
export const getProjectById = async (
  dealId: string,
): Promise<(DealProject & { managers: ManagerShortInfo[] }) | null> => {
  try {
    const user = await requireUser()
    const { userId } = user

    if (!dealId) {
      return handleError("Недостаточно данных")
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
    const managers = formatManagers(projectManagers)

    const isExistUserInManagersList = managers.some((man) => man.id === userId)
    const isOwner = userId === deal.userId

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId },
    })

    const formattedProject = {
      ...rest,
      type: DEAL_TYPE.PROJECT,
      amountCP: toDecimalString(deal.amountCP),
      amountWork: toDecimalString(deal.amountWork),
      amountPurchase: toDecimalString(deal.amountPurchase),
      delta: toDecimalString(deal.delta),
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
    const managers = formatManagers(retailManagers)

    const isExistUserInManagersList = managers.some((man) => man.id === user.userId)
    const isOwner = user.userId === deal.userId

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId },
    })

    const formattedRetail = {
      ...rest,
      type: DEAL_TYPE.RETAIL,
      amountCP: toDecimalString(deal.amountCP),
      delta: toDecimalString(deal.delta),
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

    const deals = await getCachedProjectUser(idDealOwner)

    const userHighlights = await prisma.userHighlight.findMany({
      where: {
        userId: user.userId,
        projectId: { in: deals.map((d) => d.id) },
      },
      select: { projectId: true, color: true },
    })

    const highlightsMap = new Map(userHighlights.map((h) => [h.projectId, h.color]))

    return deals.map((deal) => ({
      ...deal,
      highlights: highlightsMap.get(deal.id) || null,
    }))
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

    return await getCachedContractsUser(idDealOwner)
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

    const deals = await getCachedRetailsUser(idDealOwner)

    const userHighlights = await prisma.userHighlight.findMany({
      where: {
        userId: user.userId,
        retailId: { in: deals.map((d) => d.id) },
      },
      select: { retailId: true, color: true },
    })

    const highlightsMap = new Map(userHighlights.map((h) => [h.retailId, h.color]))
    return deals.map((deal) => {
      return {
        ...deal,
        highlights: highlightsMap.get(deal.id) || null,
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

    return await getCachedAllProjectsByDepartment(departmentIdValue)
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

    return await getCachedAllRetailsByDepartment(departmentIdValue)
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
    const allDeals = await getCachedAllDealsRequestSourceByDepartment(departmentId)

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
    const allDeals = await getCachedAllDealsByDepartment(departmentId)

    const totalDealsCount = allDeals.length || 0

    return { deals: allDeals, totalDealsCount } as DealsList
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

const dateRangeCalculators: Record<DateRange, (now: Date) => Date> = {
  week: (now) => {
    const date = new Date(now)
    date.setDate(date.getDate() - 7)
    return date
  },
  month: (now) => {
    const date = new Date(now)
    date.setMonth(date.getMonth() - 1)
    return date
  },
  threeMonths: (now) => {
    const date = new Date(now)
    date.setMonth(date.getMonth() - 3)
    return date
  },
  halfYear: (now) => {
    const date = new Date(now)
    date.setMonth(date.getMonth() - 6)
    return date
  },
  year: (now) => {
    const date = new Date(now)
    date.setFullYear(date.getFullYear() - 1)
    return date
  },
}

export const getDealsByDateRange = async (
  idDealOwner: string,
  range: DateRange,
  departmentId: number,
) => {
  const user = await requireUser()

  if (!idDealOwner) {
    return handleError("Недостаточно данных")
  }

  const isOwner = user.userId === idDealOwner

  if (!isOwner) {
    await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
  }

  const now = new Date()
  now.setHours(23, 59, 59, 999)

  const startDate = dateRangeCalculators[range](now)
  startDate.setHours(0, 0, 0, 0)

  const [dealsP, dealsR] = await Promise.all([
    prisma.project.findMany({
      where: {
        dateRequest: { gte: startDate, lte: now },
        projectManagers: {
          some: {
            userId: idDealOwner,
            user: { departmentId },
          },
        },
      },
      orderBy: { dateRequest: "asc" },
    }),
    prisma.retail.findMany({
      where: {
        dateRequest: { gte: startDate, lte: now },
        retailManagers: {
          some: {
            userId: idDealOwner,
            user: { departmentId },
          },
        },
      },
      orderBy: { dateRequest: "asc" },
    }),
  ])

  const calculateStats = (deals: typeof dealsP | typeof dealsR) => {
    const paid = deals.filter((item) => item.dealStatus === "PAID")
    const closed = deals.filter((item) => item.dealStatus === "CLOSED")
    const reject = deals.filter((item) => item.dealStatus === "REJECT")
    const withMoney = deals.filter(
      (item) => item.dealStatus === "CLOSED" || item.dealStatus === "PAID",
    )

    const money = withMoney.reduce(
      (acc, item) => {
        acc.sumCp += Number(item.amountCP)
        acc.sumDelta += Number(item.delta)
        return acc
      },
      { sumCp: 0, sumDelta: 0 },
    )

    return {
      length: deals.length,
      reject: reject.length,
      paid: paid.length,
      closed: closed.length,
      money,
    }
  }

  return {
    projects: calculateStats(dealsP),
    retails: calculateStats(dealsR),
  }
}

/******************************************Создать *********************************************************/

export const createProject = async (
  data: ProjectReq & { managersIds: { userId: string }[] },
): Promise<ProjectResponse> => {
  try {
    if (!data) return handleError("Ошибка: данные не переданы")
    if (data.dealStatus !== StatusProject.REQUEST) {
      await checkAuthAndDataFill(data)
    }

    const user = await requireUser()

    const { amountCP, amountPurchase, amountWork, delta, contacts, managersIds, ...dealData } = data

    const idDeal = (dealData.id as string) || cuid()
    const safeAmountCP = new Prisma.Decimal(amountCP as string)
    const safeDelta = new Prisma.Decimal(delta as string)
    const safeAmountWork = new Prisma.Decimal(amountWork as string)
    const safeAmountPurchase = new Prisma.Decimal(amountPurchase as string)

    const newDeal = await prisma.project.create({
      data: {
        id: idDeal,
        direction: dealData.direction,
        deliveryType: dealData.deliveryType,
        dealStatus: dealData.dealStatus,
        dateRequest: dealData.dateRequest,
        nameDeal: data.nameDeal ?? "",
        nameObject: data.nameObject ?? "",
        inn: data.inn ?? "",
        contact: data?.contact ?? "",
        comments: data.comments ?? "",
        commentsLastConnection: data.commentsLastConnection ?? "",
        resource: data.resource ?? "",

        userId: data.userId as string,

        amountCP: safeAmountCP,
        delta: safeDelta,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,

        highlights: undefined,

        additionalContacts: {
          create: (Array.isArray(contacts) ? contacts : []).map((c) => ({
            name: c.name ?? "",
            phone: c.phone ?? null,
            email: c.email ?? null,
            position: c.position ?? null,
          })),
        },

        projectManagers: {
          create: managersIds.map((m) => ({
            user: { connect: { id: m.userId } },
          })),
        },
      },
    })

    updateManagerTags(managersIds, "project")

    if (data.userId) {
      updateTag(tagKeysDealActions.projectsUser(data.userId as string))
    }

    const targetDepartmentId = await getTargetDepartmentId(user.departmentId, data.userId || null)

    updateDepartmentTags(targetDepartmentId, "all")
    updateTag(tagKeysDealActions.additionalContacts(idDeal))

    return {
      ...newDeal,
      amountCP: toDecimalString(newDeal.amountCP) || "0",
      amountWork: toDecimalString(newDeal.amountWork) || "0",
      amountPurchase: toDecimalString(newDeal.amountPurchase) || "0",
      delta: toDecimalString(newDeal.delta) || "0",
    } as unknown as ProjectResponse
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const createRetail = async (data: RetailReq & { managersIds: { userId: string }[] }) => {
  try {
    if (!data) return handleError("Ошибка: данные не переданы")

    if (data.dealStatus !== StatusRetail.REQUEST) {
      await checkAuthAndDataFill(data)
    }
    const user = await requireUser()

    const { amountCP, delta, contacts, managersIds, ...dealData } = data

    const idDeal = (dealData?.id as string) || cuid()

    const newDeal = await prisma.retail.create({
      data: {
        ...dealData,
        id: idDeal,
        userId: data.userId as string,
        direction: dealData.direction,
        deliveryType: dealData.deliveryType,
        dealStatus: dealData.dealStatus,
        dateRequest: dealData.dateRequest,
        nameDeal: data.nameDeal ?? "",
        nameObject: data.nameObject ?? "",
        inn: data.inn ?? "",
        contact: data?.contact ?? "",
        comments: data.comments ?? "",
        commentsLastConnection: data.commentsLastConnection ?? "",
        resource: data.resource ?? "",
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

    updateManagerTags(managersIds, "retail")

    if (data.userId) {
      updateTag(tagKeysDealActions.retailsUser(data.userId as string))
    }

    const targetDepartmentId = await getTargetDepartmentId(user.departmentId, data.userId || null)

    updateDepartmentTags(targetDepartmentId, "all")
    updateTag(tagKeysDealActions.additionalContacts(idDeal))

    return {
      ...newDeal,
      amountCP: toDecimalString(newDeal.amountCP) || "0",
      delta: toDecimalString(newDeal.delta) || "0",
    } as unknown as RetailResponse
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

/********************************************************* Обновить проект ********************************************/

export const updateProject = async (
  data: ProjectReq,
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

      await tx.project.update({
        where: { id },
        data: { additionalContacts: { set: [] } },
      })

      const updatedProject = await tx.project.update({
        where: { id },
        data: {
          ...dealData,
          nameDeal: data.nameDeal ?? "",
          amountCP: toDec(amountCP),
          amountPurchase: toDec(amountPurchase),
          amountWork: toDec(amountWork),
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
          projectManagers: {
            include: {
              user: { select: { id: true, username: true, position: true } },
            },
          },
        },
      })

      return updatedProject
    })

    const oldManagersIds = deal.projectManagers.map((pm) => pm.userId)
    const newManagersIds = managersIds.map((m) => m.userId as string)
    const allAffectedUsers = Array.from(
      new Set([user.userId, ...oldManagersIds, ...newManagersIds]),
    )

    const targetDepartmentId = await getTargetDepartmentId(user.departmentId, deal.userId)

    for (const userIdOfManager of allAffectedUsers) {
      updateTag(tagKeysDealActions.projectsUser(userIdOfManager))
    }
    updateTag(tagKeysDealActions.allProjectsDep(targetDepartmentId))
    updateTag(tagKeysDealActions.allDealsDep(targetDepartmentId))
    updateTag(tagKeysDealActions.additionalContacts(id))

    if (
      (finalDeal.dealStatus === "PAID" || finalDeal.dealStatus === "CLOSED") &&
      finalDeal.userId
    ) {
      updateTag(tagKeysDealActions.constractUser(finalDeal.userId))
    }

    const { createdAt, updatedAt, projectManagers, ...rest } = finalDeal

    return {
      success: true,
      data: {
        ...rest,
        amountCP: toDecimalString(finalDeal.amountCP) || "0",
        amountWork: toDecimalString(finalDeal.amountWork) || "0",
        amountPurchase: toDecimalString(finalDeal.amountPurchase) || "0",
        delta: toDecimalString(finalDeal.delta) || "0",
        managers: formatManagers(projectManagers).map((m) => ({
          ...m,
          managerName: m.username,
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
  data: RetailReq,
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
          nameDeal: dealData.nameDeal || "",
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

    const oldManagersIds = deal.retailManagers.map((rm) => rm.userId)
    const newManagersIds = managersIds.map((m) => m.userId as string)

    const allAffectedUsers = Array.from(
      new Set([user.userId, ...oldManagersIds, ...newManagersIds]),
    )

    const targetDepartmentId = await getTargetDepartmentId(user.departmentId, deal.userId)

    for (const userIdOfManager of allAffectedUsers) {
      updateTag(tagKeysDealActions.retailsUser(userIdOfManager))
    }

    updateTag(tagKeysDealActions.allRetailsDep(targetDepartmentId))
    updateTag(tagKeysDealActions.allDealsDep(targetDepartmentId))
    updateTag(tagKeysDealActions.additionalContacts(retailId))

    const managers = formatManagers(finalDeal.retailManagers).map((m) => ({
      ...m,
      managerName: m.username,
    }))

    const { createdAt, updatedAt, retailManagers, ...rest } = finalDeal

    return {
      success: true,
      data: {
        ...rest,
        amountCP: toDecimalString(finalDeal.amountCP) || "0",
        delta: toDecimalString(finalDeal.delta) || "0",
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

    const targetDepartmentId = await getTargetDepartmentId(user.departmentId, deal.userId)

    updateManagerTags(managers, isProject ? "project" : "retail")
    updateDepartmentTags(targetDepartmentId, "all")

    if ((deal.dealStatus === "PAID" || deal.dealStatus === "CLOSED") && deal.userId) {
      updateTag(tagKeysDealActions.constractUser(deal.userId))
    }

    updateTag(tagKeysDealActions.additionalContacts(dealId))

    return {
      success: true,
      data: { managers, depId: targetDepartmentId },
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
  departmentId: number,
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

    const [projects, retails, managersResult, files] = await Promise.all([
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
      Promise.all([
        projectsIds.length
          ? prisma.projectManager.findMany({
              where: { dealId: { in: projectsIds } },
              select: { userId: true },
            })
          : [],
        retailsIds.length
          ? prisma.retailManager.findMany({
              where: { dealId: { in: retailsIds } },
              select: { userId: true },
            })
          : [],
      ]),
      prisma.dealFile.findMany({ where: { dealId: { in: allIds } } }),
    ])

    const contactIds = [
      ...new Set([...projects, ...retails].flatMap((d) => d.additionalContacts.map((c) => c.id))),
    ]

    await prisma.$transaction(async (tx) => {
      if (projectsIds.length) {
        await tx.projectManager.deleteMany({
          where: { dealId: { in: projectsIds } },
        })
        await tx.project.deleteMany({ where: { id: { in: projectsIds } } })
      }
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

    const [projectManagers, retailManagers] = managersResult

    if (projectManagers.length > 0) {
      const uniqueProjectUserIds = [...new Set(projectManagers.map((pm) => pm.userId))]
      for (const managerId of uniqueProjectUserIds) {
        updateTag(tagKeysDealActions.projectsUser(managerId))
      }
    }

    if (retailManagers.length > 0) {
      const uniqueRetailUserIds = [...new Set(retailManagers.map((rm) => rm.userId))]
      for (const managerId of uniqueRetailUserIds) {
        updateTag(tagKeysDealActions.retailsUser(managerId))
      }
    }

    updateDepartmentTags(departmentId, "all")

    if (projectsIds.length > 0) {
      const closedOrPaidProjectUserIds = [
        ...new Set(
          projects
            .filter((p) => (p.dealStatus === "PAID" || p.dealStatus === "CLOSED") && p.userId)
            .map((p) => p.userId as string),
        ),
      ]
      for (const ownerId of closedOrPaidProjectUserIds) {
        updateTag(tagKeysDealActions.constractUser(ownerId))
      }
    }

    for (const dealId of allIds) {
      updateTag(tagKeysDealActions.additionalContacts(dealId))
    }

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

    const contacts = await getCachedAdditionalContacts(dealId)

    return contacts
  } catch (error) {
    console.error(`[DB_ERROR] dealId: ${dealId}`, error)
    return handleError("Не удалось загрузить контакты. Попробуйте позже.")
  }
}

export const reassignDealsToManager = async (
  data: ReAssignDeal,
): Promise<{ success: boolean; message: string; error: boolean }> => {
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

    const [oldProjectManagers, oldRetailManagers] = await Promise.all([
      projectIds.length
        ? prisma.projectManager.findMany({
            where: { dealId: { in: projectIds } },
            select: { userId: true },
          })
        : [],
      retailIds.length
        ? prisma.retailManager.findMany({
            where: { dealId: { in: retailIds } },
            select: { userId: true },
          })
        : [],
    ])

    const oldProjectUserIds = oldProjectManagers.map((m) => m.userId)
    const oldRetailUserIds = oldRetailManagers.map((m) => m.userId)

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

    if (projectIds.length > 0) {
      const affectedProjectUsers = [...new Set([...oldProjectUserIds, newManagerId])]
      for (const managerId of affectedProjectUsers) {
        updateTag(tagKeysDealActions.projectsUser(managerId))
      }
      updateTag(tagKeysDealActions.allProjectsDep(user.departmentId))

      updateTag(tagKeysDealActions.constractUser(newManagerId))
      for (const oldId of oldProjectUserIds) {
        updateTag(tagKeysDealActions.constractUser(oldId))
      }
    }

    if (retailIds.length > 0) {
      const affectedRetailUsers = [...new Set([...oldRetailUserIds, newManagerId])]
      for (const managerId of affectedRetailUsers) {
        updateTag(tagKeysDealActions.retailsUser(managerId))
      }
      updateTag(tagKeysDealActions.allRetailsDep(user.departmentId))
    }

    updateTag(tagKeysDealActions.allDealsDep(user.departmentId))

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

    if (!color) return { success: false, error: "Цвет не указан" }

    const isProject = type === DEAL_TYPE.PROJECT

    const selector = isProject
      ? { userId_projectId: { userId, projectId: id } }
      : { userId_retailId: { userId, retailId: id } }

    const data = isProject ? { userId, projectId: id, color } : { userId, retailId: id, color }

    await prisma.userHighlight.upsert({
      where: selector,
      update: { color },
      create: data,
    })

    return { success: true, type, userId: ownerDealId }
  } catch (error) {
    console.error("[setHighlight Error]:", error)
    return handleError((error as Error).message)
  }
}

export const getHilightList = async () => {
  try {
    const user = await requireUser()

    return await prisma.userHighlight.findMany({
      where: { userId: user.userId },
    })
  } catch (error) {
    console.error("[getHilightList Error]:", error)
    return []
  }
}

export const deleteHighlight = async (higlightData: DealHighlightdeletedType) => {
  try {
    const user = await requireUser()
    const { type, color, userId: ownerDealId, all } = higlightData
    const userId = user.userId

    const isProject = type === DEAL_TYPE.PROJECT

    if (all) {
      await prisma.userHighlight.deleteMany({
        where: isProject
          ? { userId, projectId: { not: null } }
          : { userId, retailId: { not: null } },
      })
      return { success: true, type, userId: ownerDealId }
    }

    if (color) {
      await prisma.userHighlight.deleteMany({
        where: isProject
          ? { userId, color, projectId: { not: null } }
          : { userId, color, retailId: { not: null } },
      })
      return { success: true, type, userId: ownerDealId }
    }

    return { success: false, error: "Недостаточно данных для удаления" }
  } catch (error) {
    console.error("[deleteHighlight Error]:", error)
    return handleError((error as Error).message)
  }
}
