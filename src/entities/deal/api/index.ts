"use server";

import {
  DealFile,
  DealType,
  PermissionEnum,
  Prisma,
  StatusContract,
  StatusOrder,
  StatusProject,
  StatusRetail,
} from "@prisma/client";

import cuid from "cuid";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { checkRole } from "@/shared/api/checkByServer";
import { handleError } from "@/shared/api/handleError";

import { AllStatusKeys } from "../lib/constants";
import {
  Contact,
  ContractResponse,
  DateRange,
  DealBase,
  ManagerShortInfo,
  ProjectResponse,
  ProjectResponseWithContactsAndFiles,
  ProjectWithManagersIds,
  ProjectWithoutDateCreateAndUpdate,
  ProjectWithoutId,
  ReAssignDeal,
  RetailResponse,
  RetailResponseWithContactsAndFiles,
  RetailWithManagersIds,
  RetailWithoutDateCreateAndUpdate,
  RetailWithoutId,
} from "../types";

const requiredFields = [
  "nameObject",
  "direction",
  "comments",
  "contact",
  "dealStatus",
];

const checkAuthAndDataFill = async (projectData: ProjectWithoutId) => {
  const data = await handleAuthorization();

  for (const field of requiredFields as (keyof ProjectWithoutId)[]) {
    if (!projectData[field]) {
      return handleError(`Отсутствует поле: ${field}`);
    }
  }

  return data;
};
/********************************************** Получить ****************************************************************/
export const getProjectById = async (
  dealId: string
): Promise<
  | (ProjectResponseWithContactsAndFiles & { managers: ManagerShortInfo[] })
  | null
> => {
  try {
    const data = await handleAuthorization();

    const { user, userId } = data!;

    if (!dealId) {
      handleError("Недостаточно данных");
    }

    const deal = await prisma.project.findUnique({
      where: { id: dealId },
      include: {
        additionalContacts: true,
        projectManagers: {
          include: { user: true },
        },
      },
    });

    if (!deal) {
      return null;
    }

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: deal.userId },
      select: { role: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError(
        "Пользователь не найден илил у вас нет прав на операцию"
      );
    }

    const { projectManagers, ...rest } = deal;

    const managers = projectManagers.map((pm) => ({
      id: pm.user.id,
      managerName: pm.user.username,
      position: pm.user.position,
    }));

    const isExistUserInManagersList = managers.some((man) => man.id === userId);

    const isOwner = userId === deal.userId;

    if (!user) {
      return handleError(
        "Пользователь не найден или у вас нет прав на операцию"
      );
    }

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId }, // Фильтруем по dealId
    });

    const formattedProject = {
      ...rest,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "", // Преобразуем Decimal в строку
      amountWork: deal.amountWork ? deal.amountWork.toString() : "",
      amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      dealFiles,
      managers,
    };

    return formattedProject;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getRetailById = async (
  dealId: string
): Promise<
  (RetailResponseWithContactsAndFiles & { managers: ManagerShortInfo[] }) | null
> => {
  try {
    const data = await handleAuthorization();

    const { user, userId } = data!;

    if (!dealId) {
      return handleError("Недостаточно данных");
    }

    const deal = await prisma.retail.findUnique({
      where: { id: dealId },
      include: {
        additionalContacts: true,
        retailManagers: {
          include: { user: true },
        },
      },
    });

    if (!deal) {
      return null;
    }

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: deal.userId },
      select: { role: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError(
        "Пользователь не найден или у вас нет прав на операцию"
      );
    }

    const { retailManagers, ...rest } = deal;

    const managers = retailManagers.map((rm) => ({
      id: rm.user.id,
      managerName: rm.user.username,
      position: rm.user.position,
    }));

    const isExistUserInManagersList = managers.some((man) => man.id === userId);

    const isOwner = userId === deal.userId;

    if (!user) {
      return handleError(
        "Пользователь не найден или у вас нет прав на операцию"
      );
    }

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId }, // Фильтруем по dealId
    });

    const formattedRetail = {
      ...rest,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      dealFiles,
      managers,
    };

    return formattedRetail;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getProjectsUser = async (
  idDealOwner: string
): Promise<ProjectResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if (!idDealOwner) {
      return handleError("Недостаточно данных");
    }

    const isOwner = userId === idDealOwner;
    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT]);
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
          include: { project: true },
        },
      },
    });

    return deals.length
      ? deals.map((deal) => ({
          ...deal,
          amountCP: deal.amountCP?.toString() || "",
          amountWork: deal.amountWork?.toString() || "",
          amountPurchase: deal.amountPurchase?.toString() || "",
          delta: deal.delta?.toString() || "",
          projectManagers: JSON.stringify(deal.projectManagers),
        }))
      : [];
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getContractsUser = async (
  idDealOwner: string
): Promise<ContractResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if (!idDealOwner) {
      return handleError("Недостаточно данных");
    }

    const isOwner = userId === idDealOwner;
    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const statuses = Object.keys(StatusContract) as Array<
      keyof typeof StatusContract
    >;

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
    });

    return deals.length
      ? deals.map((deal) => {
          const { amountCP, amountWork, amountPurchase, delta, ...restDeal } =
            deal;
          return {
            ...restDeal,
            amountCP: amountCP?.toString() || "",
            amountWork: amountWork?.toString() || "",
            amountPurchase: amountPurchase?.toString() || "",
            delta: delta?.toString() || "",
          };
        })
      : [];
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getRetailsUser = async (
  idDealOwner: string
): Promise<RetailResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if (!idDealOwner) {
      return handleError("Недостаточно данных");
    }

    const isOwner = userId === idDealOwner;

    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT]);
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
          include: { retail: true },
        },
      },
    });

    const dealsFormat = deals.length
      ? deals.map((deal) => ({
          ...deal,
          amountCP: deal.amountCP ? deal.amountCP.toString() : "",
          delta: deal.delta ? deal.delta.toString() : "",
          retailManagers: JSON.stringify(deal.retailManagers),
        }))
      : [];

    return dealsFormat;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getAllProjectsByDepartment = async (
  departmentId?: number | undefined
): Promise<ProjectResponse[]> => {
  try {
    const { user } = await handleAuthorization();

    await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_UNION_REPORT]);

    const departmentIdValue =
      departmentId !== undefined ? departmentId : user!.departmentId;

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
                username: true,
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
    });

    return deals.length
      ? deals.map((deal) => ({
          ...deal,
          user: deal.user.username,
          amountCP: deal.amountCP ? deal.amountCP.toString() : "",
          amountWork: deal.amountWork ? deal.amountWork.toString() : "",
          amountPurchase: deal.amountPurchase
            ? deal.amountPurchase.toString()
            : "",
          delta: deal.delta ? deal.delta.toString() : "",
        }))
      : [];
  } catch (error) {
    console.log(error);
    return handleError((error as Error).message);
  }
};

export const getAllRetailsByDepartment = async (
  departmentId: number
): Promise<RetailResponse[]> => {
  try {
    const { user } = await handleAuthorization();

    const permissionError = await checkUserPermissionByRole(user!, [
      PermissionEnum.VIEW_UNION_REPORT,
    ]);

    if (permissionError) return permissionError;
    const departmentIdValue =
      departmentId !== undefined ? departmentId : user!.departmentId;

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
                username: true,
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
    });

    return deals.length
      ? deals.map((deal) => ({
          ...deal,
          user: deal.user.username,
          amountCP: deal.amountCP ? deal.amountCP.toString() : "",
          delta: deal.delta ? deal.delta.toString() : "",
        }))
      : [];
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

type DealsListWithResource =
  | {
      deals: {
        dateRequest: Date;
        resource: string;
        dealStatus: AllStatusKeys;
      }[];
      totalDealsCount: number;
    }
  | { deals: []; totalDealsCount: number };

type DealsList =
  | {
      deals: DealBase[];
      totalDealsCount: number;
    }
  | { deals: []; totalDealsCount: number };

export const getAllDealsRequestSourceByDepartment = async (
  departmentId: number
): Promise<DealsListWithResource> => {
  try {
    await handleAuthorization();

    const retailsRequestResorce = await prisma.retail.findMany({
      where: {
        user: {
          departmentId,
        },
      },
      select: {
        dateRequest: true,
        resource: true,
        dealStatus: true,
      },
      orderBy: {
        dateRequest: "asc",
      },
    });

    const projectsRequestResource = await prisma.project.findMany({
      where: {
        user: {
          departmentId,
        },
      },
      select: {
        dateRequest: true,
        resource: true,
        dealStatus: true,
      },
      orderBy: {
        dateRequest: "asc",
      },
    });

    const allDeals = [...retailsRequestResorce, ...projectsRequestResource];

    const totalDealsCount = allDeals.length || 0;

    return { deals: allDeals, totalDealsCount } as DealsListWithResource;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getAllDealsByDepartment = async (
  departmentId: number
): Promise<DealsList> => {
  try {
    await handleAuthorization();

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
    });

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
    });

    const allDeals = [...retailsRequestResorce, ...projectsRequestResource];

    const totalDealsCount = allDeals.length || 0;

    return { deals: allDeals, totalDealsCount } as DealsList;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getDealsByDateRange = async (
  idDealOwner: string,
  range: DateRange,
  departmentId: number
) => {
  const data = await handleAuthorization();

  const { user, userId } = data!;

  if (!idDealOwner) {
    return handleError("Недостаточно данных");
  }

  const isOwner = userId === idDealOwner;

  if (!isOwner) {
    await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT]);
  }

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  let startDate: Date;

  switch (range) {
    case "week":
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      break;

    case "month":
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
      break;

    case "threeMonths":
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 3);
      break;

    case "halfYear":
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 6);
      break;

    case "year":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      break;

    default:
      throw new Error("Некорректный диапазон дат");
  }

  startDate.setHours(0, 0, 0, 0);

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
  })) as unknown as ProjectResponse[];

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
  })) as unknown as RetailResponse[];

  const paidDealsP = dealsP.filter((item) => item.dealStatus === "PAID");
  const closedDealsP = dealsP.filter((item) => item.dealStatus === "CLOSED");
  const rejectDealsP = dealsP.filter((item) => item.dealStatus === "REJECT");
  const paidDealsR = dealsR.filter((item) => item.dealStatus === "PAID");
  const closedDealsR = dealsR.filter((item) => item.dealStatus === "CLOSED");
  const rejectDealsR = dealsR.filter((item) => item.dealStatus === "REJECT");
  const dealPwithMoney = dealsP.filter(
    (item) => item.dealStatus === "CLOSED" || item.dealStatus === "PAID"
  );
  const dealRwithMoney = dealsR.filter(
    (item) => item.dealStatus === "CLOSED" || item.dealStatus === "PAID"
  );
  const commercialOfferAmountsP = dealPwithMoney.reduce(
    (acc, item) => {
      acc.sumCp += Number(item.amountCP);
      acc.sumDelta += Number(item.delta);
      return acc;
    },
    { sumCp: 0, sumDelta: 0 }
  );
  const commercialOfferAmountsR = dealRwithMoney.reduce(
    (acc, item) => {
      acc.sumCp += Number(item.amountCP);
      acc.sumDelta += Number(item.delta);
      return acc;
    },
    { sumCp: 0, sumDelta: 0 }
  );

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
  };
};

/******************************************Создать *********************************************************/

export const createProject = async (
  data: ProjectWithoutId & { managersIds: { userId: string }[] }
): Promise<ProjectResponse> => {
  try {
    if (!data) {
      return handleError("Ошибка: данные не переданы");
    }

    const { user } = await checkAuthAndDataFill(data);

    const {
      amountCP,
      amountPurchase,
      amountWork,
      delta,
      contacts,
      managersIds,
      ...dealData
    } = data;

    const safeAmountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);
    const safeAmountWork = new Prisma.Decimal(amountWork as string);
    const safeAmountPurchase = new Prisma.Decimal(amountPurchase as string);
    const idDeal = cuid();
    const idOrder = cuid();

    const isExistOrder = await prisma.order.findUnique({
      where: {
        id: (dealData.orderId as string) || idOrder,
      },
    });

    const orderData = {
      nameDeal: (dealData.nameDeal as string) ?? "",
      email: (dealData.email as string) ?? "",
      manager: (data.userId as string) ?? "",
      contact: (dealData.contact as string) ?? "",
      phone: (dealData.phone as string) ?? "",
      comments: (dealData.comments as string) ?? "",
      resource: (dealData.resource as string) ?? "",
      type: DealType.PROJECT,
      projectId: (dealData.id as string) || idDeal,
      dateRequest: dealData.dateRequest
        ? new Date(dealData.dateRequest as string)
        : new Date(),
      departmentId: user?.departmentId ?? 0,
      orderStatus:
        dealData.dealStatus !== StatusProject.CLOSED
          ? StatusOrder.AT_WORK
          : StatusOrder.CLOSED,
    };

    if (isExistOrder) {
      await prisma.order.update({
        where: {
          id: isExistOrder.id as string,
        },
        data: {
          nameDeal: orderData.nameDeal,
          email: orderData.email,
          manager: orderData.manager,
          contact: orderData.contact,
          phone: orderData.phone,
          comments: orderData.comments,
          resource: orderData.resource,
          type: orderData.type,
          projectId: orderData.projectId,
          dateRequest: orderData.dateRequest,
          departmentId: orderData.departmentId,
          orderStatus: orderData.orderStatus,
        },
      });
    } else {
      await prisma.order.create({
        data: {
          ...orderData,
          id: idOrder,
        },
      });
    }

    const newDeal = await prisma.project.create({
      data: {
        ...(dealData as ProjectResponse),
        id: idDeal,
        userId: data.userId as string,
        amountCP: safeAmountCP,
        delta: safeDelta,
        orderId: (dealData?.orderId as string | undefined) || idOrder,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,
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
    });

    const formattedDeal = {
      ...newDeal,
      amountCP: safeAmountCP.toString(),
      amountWork: safeAmountWork.toString(),
      amountPurchase: safeAmountPurchase.toString(),
      delta: safeDelta.toString(),
    };

    return formattedDeal;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const createRetail = async (
  data: RetailWithoutId & { managersIds: { userId: string }[] }
) => {
  try {
    if (!data) {
      return handleError("Ошибка: данные не переданы");
    }

    const { user } = await checkAuthAndDataFill(data);

    const { amountCP, delta, contacts, managersIds, ...dealData } = data;

    const safeamountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);

    const idDeal = cuid();
    const idOrder = cuid();

    const isExistOrder = await prisma.order.findUnique({
      where: {
        id: (dealData.orderId as string) || idOrder,
      },
    });

    const orderData = {
      nameDeal: (dealData.nameDeal as string) ?? "",
      email: (dealData.email as string) ?? "",
      manager: (data.userId as string) ?? "",
      contact: (dealData.contact as string) ?? "",
      phone: (dealData.phone as string) ?? "",
      comments: (dealData.comments as string) ?? "",
      resource: (dealData.resource as string) ?? "",
      type: DealType.RETAIL,
      retailId: (dealData.id as string) || idDeal,
      dateRequest: dealData.dateRequest
        ? new Date(dealData.dateRequest as string)
        : new Date(),
      departmentId: user?.departmentId ?? 0,
      orderStatus:
        dealData.dealStatus !== StatusRetail.CLOSED
          ? StatusOrder.AT_WORK
          : StatusOrder.CLOSED,
    };

    if (isExistOrder) {
      await prisma.order.update({
        where: {
          id: isExistOrder.id as string,
        },
        data: {
          nameDeal: orderData.nameDeal,
          email: orderData.email,
          manager: orderData.manager,
          contact: orderData.contact,
          phone: orderData.phone,
          comments: orderData.comments,
          resource: orderData.resource,
          type: orderData.type,
          retailId: orderData.retailId,
          dateRequest: orderData.dateRequest,
          departmentId: orderData.departmentId,
          orderStatus: orderData.orderStatus,
        },
      });
    } else {
      await prisma.order.create({
        data: {
          ...orderData,
          id: idOrder,
        },
      });
    }

    const newDeal = await prisma.retail.create({
      data: {
        ...(dealData as RetailResponse),
        id: idDeal,
        userId: data.userId as string,
        amountCP: safeamountCP,
        delta: safeDelta,
        orderId: (dealData.orderId as string) || idOrder,
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
    });

    const formattedDeal = {
      ...newDeal,
      amountCP: safeamountCP.toString(),
      delta: safeDelta.toString(),
    };

    return formattedDeal;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

/********************************************************* Обновить проект ********************************************/
export const updateProject = async (
  data: ProjectWithManagersIds
): Promise<ProjectWithoutDateCreateAndUpdate | null> => {
  try {
    const { userId, user } = await checkAuthAndDataFill(data);
    const {
      id,
      amountCP,
      amountPurchase,
      amountWork,
      delta,
      contacts,
      managersIds,
      ...dealData
    } = data;

    const deal = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        additionalContacts: true,
        projectManagers: {
          include: { user: true },
        },
      },
    });

    console.log("deal", deal);

    if (!deal) {
      return null;
    }

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: deal.userId },
      select: { role: true, id: true, username: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError(
        "Пользователь не найден или у вас нет прав на операцию"
      );
    }

    const managers = deal.projectManagers.map((pm) => ({
      id: pm.user.id,
      managerName: pm.user.username,
      position: pm.user.position,
    }));

    const isExistUserInManagersList = managers.some((man) => man.id === userId);

    const isOwner =
      deal.userId === userId ||
      managersIds.find((item) => item.userId === userId);

    if (!user) {
      return handleError(
        "Пользователь не найден или у вас нет прав на операцию"
      );
    }

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.DEAL_MANAGEMENT]);
    }

    const safeAmountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);
    const safeAmountWork = new Prisma.Decimal(amountWork as string);
    const safeAmountPurchase = new Prisma.Decimal(amountPurchase as string);

    const idOrder = cuid();

    const isExistOrder = await prisma.order.findUnique({
      where: {
        projectId: deal.id,
      },
    });

    const orderData = {
      nameDeal: (dealData.nameDeal as string) ?? "",
      email: (dealData.email as string) ?? "",
      manager: (data.userId as string) ?? "",
      contact: (dealData.contact as string) ?? "",
      phone: (dealData.phone as string) ?? "",
      comments: (dealData.comments as string) ?? "",
      resource: (dealData.resource as string) ?? "",
      type: DealType.PROJECT,
      projectId: id as string,
      dateRequest: dealData.dateRequest
        ? new Date(dealData.dateRequest as string)
        : new Date(),
      departmentId: user?.departmentId ?? 0,
      orderStatus:
        dealData.dealStatus !== StatusProject.CLOSED
          ? StatusOrder.AT_WORK
          : StatusOrder.CLOSED,
    };

    await prisma.$transaction(async (prisma) => {
      // 1. Удаляем старых менеджеров
      await prisma.projectManager.deleteMany({
        where: {
          dealId: deal.id,
        },
      });

      // 2. Добавляем новых менеджеров (если они есть)
      if (managersIds.length > 0) {
        await prisma.projectManager.createMany({
          data: managersIds.map((manager) => ({
            dealId: deal.id,
            userId: manager.userId,
          })),
        });
      }
    });

    const updatedDeal = await prisma.project.update({
      where: { id: deal.id },
      data: {
        ...dealData,
        amountCP: safeAmountCP,
        delta: safeDelta,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,
        orderId: deal?.orderId || idOrder,
      },
    });

    if (isExistOrder) {
      await prisma.order.update({
        where: {
          projectId: deal.id as string,
        },
        data: {
          nameDeal: orderData.nameDeal,
          email: orderData.email,
          manager: orderData.manager,
          contact: orderData.contact,
          phone: orderData.phone,
          comments: orderData.comments,
          resource: orderData.resource,
          type: orderData.type,
          projectId: orderData.projectId,
          dateRequest: orderData.dateRequest,
          departmentId: orderData.departmentId,
          orderStatus: orderData.orderStatus,
        },
      });
    } else {
      await prisma.order.create({
        data: {
          ...orderData,
          id: idOrder,
        },
      });
    }

    if (contacts && (contacts as Contact[]).length > 0) {
      // Удаление старых контактов
      await prisma.additionalContact.deleteMany({
        where: {
          projects: {
            some: { id: updatedDeal.id },
          },
        },
      });

      // Добавление новых контактов
      const newContacts = (contacts as Contact[]).map((contact) => ({
        name: contact.name ?? "",
        phone: contact.phone ?? null,
        email: contact.email ?? null,
        position: contact.position ?? null,
        projects: {
          connect: { id: updatedDeal.id }, // Связываем контакты с обновленным проектом
        },
      }));

      // Используем create вместо createMany
      for (const contact of newContacts) {
        await prisma.additionalContact.create({
          data: contact,
        });
      }
    } else {
      // Если контакты не переданы, удаляем все контакты для этого проекта
      await prisma.additionalContact.deleteMany({
        where: {
          projects: {
            some: { id: updatedDeal.id },
          },
        },
      });
    }

    const finalDeal = await prisma.project.findUnique({
      where: { id: updatedDeal.id },
      include: {
        additionalContacts: true,
      },
    });

    if (!finalDeal) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...restDeal } = finalDeal;

    const formattedDeal = {
      ...restDeal,
      amountCP: restDeal.amountCP ? restDeal.amountCP.toString() : "",
      amountWork: restDeal.amountWork ? restDeal.amountWork.toString() : "",
      amountPurchase: restDeal.amountPurchase
        ? restDeal.amountPurchase.toString()
        : "",
      delta: restDeal.delta ? restDeal.delta.toString() : "",
    };

    return formattedDeal;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const updateRetail = async (
  data: RetailWithManagersIds
): Promise<RetailWithoutDateCreateAndUpdate | null> => {
  try {
    const { userId, user } = await checkAuthAndDataFill(data);

    const { id, amountCP, delta, contacts, managersIds, ...dealData } = data;

    const deal = await prisma.retail.findUnique({
      where: { id: id as string },
      include: {
        additionalContacts: true, // Включаем контакты проекта
        retailManagers: {
          include: { user: true },
        },
      },
    });

    if (!deal) {
      return null;
    }

    const managers = deal.retailManagers.map((rm) => ({
      id: rm.user.id,
      managerName: rm.user.username,
      position: rm.user.position,
    }));

    const isExistUserInManagersList = managers.some((man) => man.id === userId);

    if (!user) {
      return handleError(
        "Пользователь не найден или у вас нет прав на операцию"
      );
    }

    const isOwner =
      deal.userId === userId ||
      managersIds.find((item) => item.userId === userId);

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user!, [PermissionEnum.DEAL_MANAGEMENT]);
    }

    const safeAmountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);

    const idOrder = cuid();

    const isExistOrder = await prisma.order.findUnique({
      where: {
        retailId: id as string,
      },
    });

    const orderData = {
      nameDeal: (dealData.nameDeal as string) ?? "",
      email: (dealData.email as string) ?? "",
      manager: (data.userId as string) ?? "",
      contact: (dealData.contact as string) ?? "",
      phone: (dealData.phone as string) ?? "",
      comments: (dealData.comments as string) ?? "",
      resource: (dealData.resource as string) ?? "",
      type: DealType.RETAIL,
      retailId: (id as string) ?? "",
      dateRequest: dealData.dateRequest
        ? new Date(dealData.dateRequest as string)
        : new Date(),
      departmentId: user?.departmentId ?? 0,
      orderStatus:
        dealData.dealStatus !== StatusRetail.CLOSED
          ? StatusOrder.AT_WORK
          : StatusOrder.CLOSED,
    };

    await prisma.$transaction(async (prisma) => {
      // 1. Удаляем старых менеджеров
      await prisma.retailManager.deleteMany({
        where: {
          dealId: deal.id,
        },
      });

      // 2. Добавляем новых менеджеров (если они есть)
      if (managersIds.length > 0) {
        await prisma.retailManager.createMany({
          data: managersIds.map((manager) => ({
            dealId: deal.id,
            userId: manager.userId,
          })),
        });
      }
    });

    const updatedDeal = await prisma.retail.update({
      where: { id: deal.id },
      data: {
        ...dealData,
        amountCP: safeAmountCP,
        delta: safeDelta,
        orderId: deal.orderId || idOrder,
      },
    });

    if (isExistOrder) {
      // Обновляем существующий заказ
      await prisma.order.update({
        where: {
          retailId: deal.id as string,
        },
        data: {
          nameDeal: orderData.nameDeal,
          email: orderData.email,
          manager: orderData.manager,
          contact: orderData.contact,
          phone: orderData.phone,
          comments: orderData.comments,
          resource: orderData.resource,
          type: orderData.type,
          retailId: orderData.retailId,
          dateRequest: orderData.dateRequest,
          departmentId: orderData.departmentId,
          orderStatus: orderData.orderStatus,
        },
      });
    } else {
      await prisma.order.create({
        data: {
          ...orderData,
          id: idOrder,
        },
      });
    }

    if (contacts && (contacts as Contact[]).length > 0) {
      // Удаление старых контактов
      await prisma.additionalContact.deleteMany({
        where: {
          retails: {
            some: { id: updatedDeal.id },
          },
        },
      });

      // Добавление новых контактов
      const newContacts = (contacts as Contact[]).map((contact) => ({
        name: contact.name ?? "",
        phone: contact.phone ?? null,
        email: contact.email ?? null,
        position: contact.position ?? null,
        retails: {
          connect: { id: updatedDeal.id },
        },
      }));

      for (const contact of newContacts) {
        await prisma.additionalContact.create({
          data: contact,
        });
      }
    } else {
      // Если контакты не переданы, удаляем все контакты для этого проекта
      await prisma.additionalContact.deleteMany({
        where: {
          retails: {
            some: { id: updatedDeal.id },
          },
        },
      });
    }

    const finalDeal = await prisma.retail.findUnique({
      where: { id: updatedDeal.id },
      include: {
        additionalContacts: true,
      },
    });

    if (!finalDeal) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...restDeal } = finalDeal;

    const formattedDeal = {
      ...restDeal,
      amountCP: restDeal.amountCP ? restDeal.amountCP.toString() : "",
      delta: restDeal.delta ? restDeal.delta.toString() : "",
    };

    return formattedDeal;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

/******************************************************* Удалить проект *********************************************/

export const deleteDeal = async (
  dealId: string,
  idDealOwner: string,
  type: DealType
) => {
  try {
    const { user } = await handleAuthorization();

    if (!dealId || !idDealOwner) {
      return handleError("Недостаточно данных");
    }

    let deal;
    let message;
    let contactIdsToCheck: string[] = [];

    switch (type) {
      case DealType.PROJECT:
        deal = await prisma.project.findUnique({
          where: { id: dealId },
          include: {
            additionalContacts: { select: { id: true } },
          },
        });
        message = "Проект успешно удален";
        break;

      case DealType.RETAIL:
        deal = await prisma.retail.findUnique({
          where: { id: dealId },
          include: {
            additionalContacts: { select: { id: true } },
          },
        });
        message = "Розничная сделка успешно удалена";
        break;

      default:
        return handleError("Неверный тип сделки");
    }

    if (!deal) {
      return handleError("Сделка не найдена");
    }

    await checkUserPermissionByRole(user!, [PermissionEnum.DEAL_MANAGEMENT]);

    contactIdsToCheck = deal.additionalContacts.map((c) => c.id);

    let managers: { dealId: string; userId: string }[] = [];

    await prisma.$transaction(async (tx) => {
      if (type === DealType.PROJECT) {
        await tx.project.update({
          where: { id: dealId },
          data: { additionalContacts: { set: [] } },
        });

        managers = await tx.projectManager.findMany({
          where: { dealId: dealId },
        });

        await tx.projectManager.deleteMany({
          where: { dealId: dealId },
        });

        await tx.order.delete({
          where: { projectId: dealId },
        });

        await tx.dealFile.deleteMany({
          where: {
            dealId: dealId,
            dealType: type,
          },
        });

        await tx.project.delete({ where: { id: dealId } });
      } else {
        await tx.retail.update({
          where: { id: dealId },
          data: { additionalContacts: { set: [] } },
        });

        await tx.retailManager.deleteMany({
          where: { dealId: dealId },
        });

        await tx.order.delete({
          where: { retailId: dealId },
        });

        await tx.dealFile.deleteMany({
          where: {
            dealId: dealId,
            dealType: type,
          },
        });

        await tx.retail.delete({ where: { id: dealId } });
      }

      // Удаляем контакты, не связанные больше ни с чем
      await Promise.all(
        contactIdsToCheck.map(async (contactId) => {
          const contact = await tx.additionalContact.findUnique({
            where: { id: contactId },
            include: {
              projects: true,
              retails: true,
            },
          });

          if (
            contact &&
            contact.projects.length === 0 &&
            contact.retails.length === 0
          ) {
            await tx.additionalContact.delete({
              where: { id: contactId },
            });
          }
        })
      );
    });

    return { managers, message, error: false };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const deleteMultipleDeals = async (
  dealIds: {
    id: string;
    type: DealType;
  }[]
): Promise<{
  managers: { userId: string; dealId: string }[];
  files: DealFile[];
  message: string;
  error: boolean;
  deletedCount: number;
}> => {
  try {
    await handleAuthorization();
    await checkRole();

    if (!dealIds || dealIds.length === 0) {
      return handleError("Недостаточно данных");
    }

    // Разделяем по типу сделки
    const projectsIds = dealIds
      .filter((d) => d.type === DealType.PROJECT)
      .map((p) => p.id);
    const retailsIds = dealIds
      .filter((d) => d.type === DealType.RETAIL)
      .map((r) => r.id);

    if (projectsIds.length === 0 && retailsIds.length === 0) {
      return handleError("Нет проектов или розницы для удаления");
    }

    // === Получаем все связанные данные ДО удаления ===
    const [projects, retails] = await Promise.all([
      projectsIds.length
        ? prisma.project.findMany({
            where: { id: { in: projectsIds } },
            include: { additionalContacts: { select: { id: true } } },
          })
        : Promise.resolve([]),
      retailsIds.length
        ? prisma.retail.findMany({
            where: { id: { in: retailsIds } },
            include: { additionalContacts: { select: { id: true } } },
          })
        : Promise.resolve([]),
    ]);

    const deals = [...projects, ...retails];
    if (deals.length === 0) {
      return handleError("Сделки не найдены");
    }

    // Собираем все контакты для возможного удаления
    const allContactIds = new Set<string>();
    deals.forEach((deal) =>
      deal.additionalContacts.forEach((c) => allContactIds.add(c.id))
    );

    // Получаем всех менеджеров ДО удаления
    const [projectManagers, retailManagers] = await Promise.all([
      projectsIds.length
        ? prisma.projectManager.findMany({
            where: { dealId: { in: projectsIds } },
          })
        : Promise.resolve([]),
      retailsIds.length
        ? prisma.retailManager.findMany({
            where: { dealId: { in: retailsIds } },
          })
        : Promise.resolve([]),
    ]);

    // Получаем все файлы ДО удаления
    const allDealIds = [...projectsIds, ...retailsIds];
    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: { in: allDealIds } },
    });

    // === Удаляем все данные транзакционно ===
    await prisma.$transaction(async (tx) => {
      if (projectsIds.length > 0) {
        await Promise.all([
          tx.projectManager.deleteMany({
            where: { dealId: { in: projectsIds } },
          }),
          tx.order.deleteMany({ where: { projectId: { in: projectsIds } } }),
          tx.dealFile.deleteMany({
            where: { dealId: { in: projectsIds }, dealType: DealType.PROJECT },
          }),
        ]);
        await tx.project.deleteMany({ where: { id: { in: projectsIds } } });
      }

      if (retailsIds.length > 0) {
        await Promise.all([
          tx.retailManager.deleteMany({
            where: { dealId: { in: retailsIds } },
          }),
          tx.order.deleteMany({ where: { retailId: { in: retailsIds } } }),
          tx.dealFile.deleteMany({
            where: { dealId: { in: retailsIds }, dealType: DealType.RETAIL },
          }),
        ]);
        await tx.retail.deleteMany({ where: { id: { in: retailsIds } } });
      }

      // Удаляем неиспользуемые контакты
      if (allContactIds.size > 0) {
        const unusedContacts = await tx.additionalContact.findMany({
          where: {
            id: { in: Array.from(allContactIds) },
            projects: { none: {} },
            retails: { none: {} },
          },
          select: { id: true },
        });

        if (unusedContacts.length > 0) {
          await tx.additionalContact.deleteMany({
            where: { id: { in: unusedContacts.map((c) => c.id) } },
          });
        }
      }
    });

    return {
      managers: [
        ...projectManagers.map((m) => ({ ...m, dealType: DealType.PROJECT })),
        ...retailManagers.map((m) => ({ ...m, dealType: DealType.RETAIL })),
      ],
      files: dealFiles,
      message: `Удалено сделок: ${deals.length} (Проектов: ${projects.length}, Розница: ${retails.length})`,
      error: false,
      deletedCount: deals.length,
    };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getAdditionalContacts = async (dealId: string) => {
  try {
    await handleAuthorization();

    return await prisma.additionalContact.findMany({
      where: {
        projects: {
          some: {
            id: dealId,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const reassignDealsToManager = async (
  data: ReAssignDeal
): Promise<{
  success: boolean;
  message: string;
  error?: boolean;
}> => {
  try {
    await handleAuthorization();
    await checkRole();

    const { dealIds, newManagerId } = data;

    // разделим сделки по типам
    const projectIds = dealIds
      .filter((d) => d.type === DealType.PROJECT)
      .map((d) => d.id);
    const retailIds = dealIds
      .filter((d) => d.type === DealType.RETAIL)
      .map((d) => d.id);

    await prisma.$transaction(async (tx) => {
      /** --- PROJECTS --- **/
      if (projectIds.length > 0) {
        // найти старых главных (чтобы удалить их из projectManager)
        const oldProjects = await tx.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, userId: true },
        });
        const oldManagerIds = oldProjects.map((p) => p.userId);

        // удалить старого главного менеджера из projectManager
        await tx.projectManager.deleteMany({
          where: {
            dealId: { in: projectIds },
            userId: { in: oldManagerIds },
          },
        });

        // добавить нового (skipDuplicates)
        await tx.projectManager.createMany({
          data: projectIds.map((id) => ({
            dealId: id,
            userId: newManagerId,
          })),
          skipDuplicates: true,
        });

        // обновить самого главного в project
        await tx.project.updateMany({
          where: { id: { in: projectIds } },
          data: { userId: newManagerId },
        });
      }

      /** --- RETAILS --- **/
      if (retailIds.length > 0) {
        const oldRetails = await tx.retail.findMany({
          where: { id: { in: retailIds } },
          select: { id: true, userId: true },
        });
        const oldRetailManagerIds = oldRetails.map((r) => r.userId);

        // удалить старого главного менеджера из retailManager
        await tx.retailManager.deleteMany({
          where: {
            dealId: { in: retailIds },
            userId: { in: oldRetailManagerIds },
          },
        });

        // добавить нового (skipDuplicates)
        await tx.retailManager.createMany({
          data: retailIds.map((id) => ({
            dealId: id,
            userId: newManagerId,
          })),
          skipDuplicates: true,
        });

        // обновить главного в retail
        await tx.retail.updateMany({
          where: { id: { in: retailIds } },
          data: { userId: newManagerId },
        });
      }
    });

    return {
      success: true,
      message: `Переназначено ${projectIds.length + retailIds.length} сделок на нового менеджера`,
    };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

// export const reassignDealsWithChecks = async (data: ReAssignDeal): Promise<{
//   success: boolean;
//   message: string;
//   error?: boolean;
// }> => {
//   try {
//     await handleAuthorization();

//     const { oldManagerId, newManagerId, options } = data;

//     const [oldManager, newManager] = await Promise.all([
//       prisma.user.findUnique({ where: { id: oldManagerId } }),
//       prisma.user.findUnique({ where: { id: newManagerId } }),
//     ]);

//     if (!oldManager) {
//       throw new Error("Прежний менеджер не найден");
//     }

//     if (!newManager) {
//       throw new Error("Новый менеджер не найден");
//     }

//     if (!options?.projectIds || options.projectIds.length > 0) {
//       const projects = options?.projectIds
//         ? { userId: oldManagerId, id: { in: options.projectIds } }
//         : { userId: oldManagerId };

//       const projectsToTransfer = await prisma.project.findMany({
//         where: projects,
//       });

//       if (projectsToTransfer.length > 0) {
//         await prisma.$transaction(async (tx) => {
//           const projectIds = projectsToTransfer.map((p) => p.id);
//           /*проверяю связь проектов с новым менеджером*/
//           const existingConnections = await tx.projectManager.findMany({
//             where: {
//               dealId: { in: projectIds },
//               userId: newManagerId,
//             },
//           });

//           const existingProjectIds = existingConnections.map((ep) => ep.dealId);
//           /*удаляю связи проектов со старым менеджером*/
//           await tx.projectManager.deleteMany({
//             where: {
//               dealId: { in: projectIds },
//               userId: oldManagerId,
//             },
//           });
//           /*создаю связь проектов со новым менеджером если их нет */

//           const projectsToConnect = projectIds.filter(
//             (projectId) => !existingProjectIds.includes(projectId)
//           );

//           if (projectsToConnect.length > 0) {
//             await tx.projectManager.createMany({
//               data: projectsToConnect.map((projectId) => ({
//                 dealId: projectId,
//                 userId: newManagerId,
//               })),
//             });
//           }
//           /*обновление проектов с новым менеджером в качестве главного*/
//           await tx.project.updateMany({
//             where: {
//               id: { in: projectIds },
//             },
//             data: {
//               userId: newManagerId,
//             },
//           });
//         });
//       }
//     }
//     if (!options?.retailIds || options.retailIds.length > 0) {
//       const retails = options?.retailIds
//         ? { userId: oldManagerId, id: { in: options.retailIds } }
//         : { userId: oldManagerId };

//       const retailsToTransfer = await prisma.retail.findMany({
//         where: retails,
//       });

//       if (retailsToTransfer.length > 0) {
//         await prisma.$transaction(async (tx) => {
//           const retailsIds = retailsToTransfer.map((r) => r.id);

//           const existingConnections = await tx.retailManager.findMany({
//             where: {
//               dealId: { in: retailsIds },
//               userId: newManagerId,
//             },
//           });

//           const existingRetailIds = existingConnections.map((er) => er.dealId);

//           await tx.retailManager.deleteMany({
//             where: {
//               dealId: { in: retailsIds },
//               userId: oldManagerId,
//             },
//           });

//           const retailsToconnection = retailsIds.filter(
//             (retailId) => !existingRetailIds.includes(retailId)
//           );

//           if (retailsToconnection.length > 0) {
//             await tx.retailManager.createMany({
//               data: retailsToconnection.map((retailId) => ({
//                 dealId: retailId,
//                 userId: newManagerId,
//               })),
//             });
//           }

//           await tx.retail.updateMany({
//             where: {
//               id: {
//                 in: retailsIds,
//               },
//             },
//             data: {
//               userId: newManagerId,
//             },
//           });
//         });
//       }
//     }

//     const dealCount = (data.options?.projectIds?.length || 0) + (data.options?.retailIds?.length || 0);
//     return {
//       success: true,
//       message: dealCount > 0 ? `Данные успешно переназначены - ${dealCount} шт`: "Данные успешно переназначены",
//     }
//   } catch (error) {
//     console.error(error);
//     return handleError((error as Error).message);
//   }
// };
