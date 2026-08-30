// /entities/del/api
"use cache"

import { StatusContract } from "@prisma/client"
import { cacheLife, cacheTag } from "next/cache"
import type { ManagerShortInfo, SerializedManagers } from "@/entities/deal/types"
import { prisma } from "@/prisma/prisma-client"

export const tagKeysDealActions = {
  projectsUser: (id: string) => `projects-user-${id}`,
  constractUser: (id: string) => `contracts-user-${id}`,
  retailsUser: (id: string) => `retails-user-${id}`,
  allProjectsDep: (depId: number) => `projects-dep-${depId}`,
  allRetailsDep: (depId: number) => `retails-dep-${depId}`,
  allDealsDep: (depId: number) => `deals-dep-${depId}`,
  sourceDealsDep: (depId: number) => `source-deals-dep-${depId}`,
  additionalContacts: (dealId: string) => `additional-contacts-${dealId}`,
}

export const getCachedProjectUser = async (idDealOwner: string) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.projectsUser(idDealOwner))
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
    },
  })

  return deals.map((deal) => {
    const serializedManagers = deal.projectManagers?.map((pm) => pm.user) ?? []
    const { projectManagers, ...restDeal } = deal

    return {
      ...restDeal,
      amountCP: deal.amountCP?.toString() || "",
      amountWork: deal.amountWork?.toString() || "",
      amountPurchase: deal.amountPurchase?.toString() || "",
      delta: deal.delta?.toString() || "",
      managers: serializedManagers, // Менеджеры общие для всех, их кэшировать можно!
    }
  })
}

export const getCachedContractsUser = async (idDealOwner: string) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.constractUser(idDealOwner))
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

  return deals.map((deal) => {
    const { amountCP, amountWork, amountPurchase, delta, ...restDeal } = deal
    return {
      ...restDeal,
      amountCP: amountCP?.toString() || "",
      amountWork: amountWork?.toString() || "",
      amountPurchase: amountPurchase?.toString() || "",
      delta: delta?.toString() || "",
    }
  })
}

export const getCachedRetailsUser = async (idDealOwner: string) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.retailsUser(idDealOwner))
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
    },
  })

  return deals.map((deal) => {
    const serializedManagers: SerializedManagers =
      deal.retailManagers?.map((pm: { user: ManagerShortInfo }) => pm.user) ?? []

    const { retailManagers, ...restDeal } = deal

    return {
      ...restDeal,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      managers: serializedManagers,
    }
  })
}

export const getCachedAllProjectsByDepartment = async (departmentIdValue: number) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.allProjectsDep(departmentIdValue))
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
}

export const getCachedAllRetailsByDepartment = async (departmentIdValue: number) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.allRetailsDep(departmentIdValue))
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
}

export const getCachedAllDealsRequestSourceByDepartment = async (departmentId: number) => {
  cacheLife("minutes")

  cacheTag(tagKeysDealActions.sourceDealsDep(departmentId))
  const [retailsRequestResorce, projectsRequestResource] = await Promise.all([
    prisma.retail.findMany({
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
    }),
    prisma.project.findMany({
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
    }),
  ])

  return [...retailsRequestResorce, ...projectsRequestResource]
}

export const getCachedAllDealsByDepartment = async (departmentId: number) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.allDealsDep(departmentId))
  const [retailsRequestResorce, projectsRequestResource] = await Promise.all([
    prisma.retail.findMany({
      where: {
        user: { departmentId },
      },
      orderBy: {
        dateRequest: "asc",
      },
    }),
    prisma.project.findMany({
      where: {
        user: { departmentId },
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
    }),
  ])

  return [...retailsRequestResorce, ...projectsRequestResource]
}

export const getCachedAdditionalContacts = async (dealId: string) => {
  cacheLife("minutes")
  cacheTag(tagKeysDealActions.additionalContacts(dealId))
  return await prisma.additionalContact.findMany({
    where: {
      OR: [{ projects: { some: { id: dealId } } }, { retails: { some: { id: dealId } } }],
    },
    orderBy: {
      name: "asc",
    },
  })
}
