"use server";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { handleError } from "@/shared/api/handleError";
import { DealType, PermissionEnum, Prisma } from "@prisma/client";
import { ProjectResponse, RetailResponse } from "../types";
import prisma from "@/prisma/prisma-client";

const requiredFields = [
  "nameObject",
  "direction",
  "comments",
  "contact",
  "dealStatus",
];

type ProjectWithoutDateCreateAndUpdate = Omit<
  ProjectResponse,
  "createdAt" | "updatedAt"
>;

type RetailWithoutDateCreateAndUpdate = Omit<
  RetailResponse,
  "createdAt" | "updatedAt"
>;

type ProjectWithoutId = Omit<ProjectWithoutDateCreateAndUpdate, "id">;

type RetailWithoutId = Omit<RetailWithoutDateCreateAndUpdate, "id">;

const checkAuthAndDataFill = async (projectData: ProjectWithoutId) => {
  const data= await handleAuthorization();

  for (const field of requiredFields as (keyof ProjectWithoutId)[]) {
    if (!projectData[field]) {
      return handleError(`Отсутствует поле: ${field}`);
    }
  }

  return data;
};

/* Получить проект */
export const getProjectById = async (
  dealId: string,
  idDealOwner: string
): Promise<ProjectResponse | null> => {
  try {
    const data = await handleAuthorization();

    const { user, userId } = data!;

    if (!dealId || !idDealOwner) {
      handleError("Недостаточно данных");
    }

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError("Пользователь не найден");
    }

    const isOwner = userId === idDealOwner;

    if (!isOwner && user) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const deal = await prisma.project.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return handleError("Проект не найден");
    }

    const formattedProject = {
      ...deal,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "", // Преобразуем Decimal в строку
      amountWork: deal.amountWork ? deal.amountWork.toString() : "",
      amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
    };
    return formattedProject;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getRetailById = async (
  dealId: string,
  idDealOwner: string
): Promise<RetailResponse | null> => {
  try {
    const data = await handleAuthorization();

    const { user, userId } = data!;

    if (!dealId || !idDealOwner) {
      return handleError("Недостаточно данных");
    }

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError("Пользователь не найден");
    }

    const isOwner = userId === idDealOwner;

    if (!isOwner && user) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const deal = await prisma.retail.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return handleError("Проект не найден");
    }

    const formattedRetail = {
      ...deal,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
    };

    return formattedRetail;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const createProject = async (data: ProjectWithoutId) => {
  try {
    if (!data) {
      return handleError("Ошибка: data не переданы в createProject");
    }
    const {userId} = await checkAuthAndDataFill(data);

    const { amountCP, amountPurchase, amountWork, delta, ...dealData } = data;

    // const existingProject = await prisma.project.findUnique({
    //   where: { nameObject },
    // });

    // if (existingProject) {
    //   return {
    //     data: null,
    //     message: "Проект с таким названием уже существует",
    //     error: true,
    //   };
    // }

    const safeAmountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);
    const safeAmountWork = new Prisma.Decimal(amountWork as string);
    const safeAmountPurchase = new Prisma.Decimal(amountPurchase as string);

    const newDeal = await prisma.project.create({
      data: {
        ...(dealData as ProjectResponse),
        userId,
        amountCP: safeAmountCP,
        delta: safeDelta,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,
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

export const createRetail = async (data: RetailWithoutId) => {
  try {
    if (!data) {
      return handleError("Ошибка: data не переданы в createProject");
    }
    const {userId} = await checkAuthAndDataFill(data);

    const { amountCP, delta, ...dealData } = data;

    // const existingProject = await prisma.project.findUnique({
    //   where: { nameObject },
    // });

    // if (existingProject) {
    //   return {
    //     data: null,
    //     message: "Проект с таким названием уже существует",
    //     error: true,
    //   };
    // }

    const safeamountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);

    const newDeal = await prisma.retail.create({
      data: {
        ...(dealData as RetailResponse),
        userId,
        amountCP: safeamountCP,
        delta: safeDelta,
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

/* Обновить проект */
export const updateProject = async (
  data: ProjectWithoutDateCreateAndUpdate
) => {
  try {
    const {userId, user} = await checkAuthAndDataFill(data);
    const { id, amountCP, amountPurchase, amountWork, delta, ...dealData } =
      data;

    const deal = await prisma.project.findUnique({
      where: { id: id as string },
    });

    if (!deal) {
      return [];
    }

    const isOwner = deal.userId !== userId;

    if (!isOwner && user) {
      await checkUserPermissionByRole(user, [PermissionEnum.DEAL_MANAGEMENT]);
    }

    const safeAmountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);
    const safeAmountWork = new Prisma.Decimal(amountWork as string);
    const safeAmountPurchase = new Prisma.Decimal(amountPurchase as string);

    const updatedDeal = await prisma.project.update({
      where: { id: deal.id },
      data: {
        ...dealData,
        userId,
        amountCP: safeAmountCP,
        delta: safeDelta,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...restDeal } = updatedDeal;

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

export const updateRetail = async (data: RetailWithoutDateCreateAndUpdate) => {
  try {
    const {userId, user} = await checkAuthAndDataFill(data);
    const { id, amountCP, delta, ...dealData } = data;

    const deal = await prisma.retail.findUnique({
      where: { id: id as string },
    });

    if (!deal) {
      return [];
    }

    const isOwner = deal.userId === userId;

    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.DEAL_MANAGEMENT]);
    }


    const safeAmountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);

    const updatedDeal = await prisma.retail.update({
      where: { id: deal.id },
      data: {
        ...(dealData as RetailResponse),
        userId,
        amountCP: safeAmountCP,
        delta: safeDelta,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...restDeal } = updatedDeal;

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

export const getProjectsUser = async (
  idDealOwner: string
): Promise<ProjectResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if (!idDealOwner) {
      return handleError("Недостаточно данных");
    }

    // if (userId === idProjectOwner) {
    //   const deals = await prisma.project.findMany({
    //     where: { userId: idProjectOwner },
    //   });

    //   return deals.length
    //   ? deals.map((deal) => ({
    //       ...deal,
    //       amountCP: deal.amountCP?.toString() || "",
    //       amountWork: deal.amountWork?.toString() || "",
    //       amountPurchase: deal.amountPurchase?.toString()||  "",
    //       delta: deal.delta?.toString() || "",
    //     }))
    //   : []; 
    // }

    const isOwner = userId === idDealOwner;

    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const deals = await prisma.project.findMany({
      where: { userId: idDealOwner },
      orderBy: {
        dateRequest: "asc",
      },
    });

    return deals.length
    ? deals.map((deal) => ({
        ...deal,
        amountCP: deal.amountCP?.toString() || "",
        amountWork: deal.amountWork?.toString() || "",
        amountPurchase: deal.amountPurchase?.toString() || "",
        delta: deal.delta?.toString() || "",
      }))
    : []; 
  } catch (error) {
    console.error(error);
    handleError((error as Error).message);
    return null;
  }
}


export const getRetailsUser = async (
  idDealOwner: string
): Promise<RetailResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if (!idDealOwner) {
      return handleError("Недостаточно данных");
    }

    // if (userId === idDealOwner) {
    //   const deals = await prisma.retail.findMany({
    //     where: { userId: idDealOwner },
    //   });

    //   return deals.length
    //   ? deals.map((deal) => ({
    //     ...deal,
    //     amountCP: deal.amountCP ? deal.amountCP.toString() : "",
    //     delta: deal.delta ? deal.delta.toString() : "",
    //   })): [];
    // }

    const isOwner = userId === idDealOwner;

    if (!isOwner) {
    await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT]);
    }

    const deals = await prisma.retail.findMany({
      where: { userId: idDealOwner },
      orderBy: {
        dateRequest: "asc",
      },
    });

    return deals.length
    ? deals.map((deal) => ({
      ...deal,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
    })) : [];

  } catch (error) {
    console.error(error);
    handleError((error as Error).message);
    return null;
  }
};

export const getAllProjectsByDepartment = async (): Promise<
  ProjectResponse[]
> => {
  try {
    const { user } = await handleAuthorization();

    await checkUserPermissionByRole(user!, [
      PermissionEnum.VIEW_UNION_REPORT,
    ]);

    const deals = await prisma.project.findMany({
      where: {
        user: {
          departmentId: +user!.departmentId, // Фильтрация через связанного пользователя
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        }, // Включаем данные владельца проекта
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
      amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
    })) : []

  } catch (error) {
    console.log(error);
    // console.error(error);
    return handleError((error as Error).message);
  }
};

export const getAllRetailsByDepartment = async (
): Promise<RetailResponse[]> => {
  try {
    const { user } = await handleAuthorization();

    const permissionError = await checkUserPermissionByRole(user!, [
      PermissionEnum.VIEW_UNION_REPORT,
    ]);

    if (permissionError) return permissionError;

    const deals = await prisma.retail.findMany({
      where: {
        user: {
          departmentId: +user!.departmentId, // Фильтрация через связанного пользователя
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        }, // Включаем данные владельца проекта
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
    })) : []

  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

/* Удалить проект */
export const deleteDeal = async (
  dealId: string,
  idDealOwner: string,
  type: string
) => {
  try {
    const { user } = await handleAuthorization();

    if (!dealId || !idDealOwner) {
      return handleError("Недостаточно данных");
    }

    let deal;
    let message;

    switch (type) {
      case DealType.PROJECT:
        deal = await prisma.project.findUnique({
          where: { id: dealId },
          select: { userId: true },
        });
        message = "Проект успешно удален";
        break;
      case DealType.RETAIL:
        deal = await prisma.retail.findUnique({
          where: { id: dealId },
          select: { userId: true },
        });
        message = "Розничная сделка успешно удалена";
        break;
      default:
        return handleError("Неверный тип сделки");
    }

    if (!deal) {
      return [];
    }

    if (deal.userId !== idDealOwner) {
       await checkUserPermissionByRole(user!, [
        PermissionEnum.DEAL_MANAGEMENT,
      ]);
    }

    switch (type) {
      case DealType.PROJECT:
        await prisma.project.delete({
          where: { id: dealId },
        });
        break;
      case DealType.RETAIL:
        await prisma.retail.delete({
          where: { id: dealId },
        });
        break;
    }

    return { data: null, message, error: false };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
