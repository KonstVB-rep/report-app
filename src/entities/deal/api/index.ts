"use server";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { handleError } from "@/shared/api/handleError";
import { Prisma } from "@prisma/client";
import { ProjectResponse, RetailResponse } from "../types";
import prisma from "@/prisma/prisma-client";
import { PrismaPermissionsMap } from "@/entities/user/model/objectTypes";

import { DealType } from "../lib/constants";


const requiredFields = [
  "nameObject",
  "direction",
  "comments",
  "contact",
  "projectStatus",
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



// const modelName = type.toLowerCase(); // Приводим к нижнему регистру, если нужно
// const model = (prisma as PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>)[modelName];

// if (!model) {
//   return handleError("Неверный тип сделки");
// }

// const deal = await model.findUnique({ where: { id: projectId } });


const checkAuthAndDataFill = async (projectData: ProjectWithoutId) => {
  const { userId } = await handleAuthorization();

  for (const field of requiredFields as (keyof ProjectWithoutId)[]) {
    if (!projectData[field]) {
      return handleError(`Отсутствует поле: ${field}`);
    }
  }

  return userId;
};

/* Получить проект */
export const getProjectById = async (
  dealId: string,
  idDealOwner: string
): Promise<ProjectResponse | null> => {
  try {
    const data = await handleAuthorization();

    if (!data) return handleError("Ошибка авторизации");

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
      await checkUserPermissionByRole(user, [PrismaPermissionsMap.VIEW_USER_REPORT]);
    }

    const project = await prisma.project.findUnique({
      where: { id: dealId },
    });

    if (!project) {
      return handleError("Проект не найден");
    }

    const formattedProject = {
      ...project,
      amountCP: project.amountCP.toString(),
      amountWork: project.amountWork.toString(),
      amountPurchase: project.amountPurchase.toString(),
      delta: project.delta.toString(),
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

    if (!data) return handleError("Ошибка авторизации");

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
      await checkUserPermissionByRole(user, [PrismaPermissionsMap.VIEW_USER_REPORT]);
    }

    const retail = await prisma.retail.findUnique({
      where: { id: dealId },
    });

    if (!retail) {
      return handleError("Проект не найден");
    }

    const formattedRetail = {
      ...retail,
      amountCP: retail.amountCP.toString(),
      delta: retail.delta.toString(),
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
    const userId = await checkAuthAndDataFill(data);


    const { amountCP, amountPurchase, amountWork, delta, ...dealData } =
      data;

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
    const safeamountWork = new Prisma.Decimal(amountWork as string);
    const safeamountPurchase = new Prisma.Decimal(amountPurchase as string);

    const newDeal = await prisma.project.create({
      data: {
        ...dealData as ProjectResponse,
        userId,
        dateRequest: new Date(),
        amountCP: safeamountCP,
        delta: safeDelta,
        amountWork: safeamountWork,
        amountPurchase: safeamountPurchase,
      },
    });

    const formattedDeal = {
      ...newDeal,
      amountCP: safeamountCP.toString(),
      amountWork: safeamountWork.toString(),
      amountPurchase: safeamountPurchase.toString(),
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
    const userId = await checkAuthAndDataFill(data);


    const { amountCP, delta, ...dealData } =
      data;

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
        ...dealData as RetailResponse,
        userId,
        dateRequest: new Date(),
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
    const userId = await checkAuthAndDataFill(data);
    const { id, amountCP, amountPurchase, amountWork, delta, ...dealData } = data;

    const deal = await prisma.project.findUnique({ where: { id: id as string } });

    if (!deal) {
      return [];
    }

    if (deal.userId !== userId) {
      return handleError("Недостаточно прав");
    }

    const safeamountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);
    const safeamountWork = new Prisma.Decimal(amountWork as string);
    const safeamountPurchase = new Prisma.Decimal(amountPurchase as string);

    const updatedDeal = await prisma.project.update({
      where: { id: deal.id },
      data: {
        ...dealData,
        userId,
        dateRequest: new Date(),
        amountCP: safeamountCP,
        delta: safeDelta,
        amountWork: safeamountWork,
        amountPurchase: safeamountPurchase,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...rest } = updatedDeal;

    const formattedDeal = {
      ...rest,
      amountCP: rest.amountCP.toString(),
      amountWork: rest.amountWork.toString(),
      amountPurchase: rest.amountPurchase.toString(),
      delta: rest.delta.toString(), // Преобразуем Decimal в строку
    };

    return formattedDeal;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const updateRetail = async (
  data: RetailWithoutDateCreateAndUpdate
) => {
  try {
    const userId = await checkAuthAndDataFill(data);
    const { id, amountCP, delta, ...dealData } = data;

    const deal = await prisma.retail.findUnique({ where: { id: id as string } });

    if (!deal) {
      return [];
    }

    if (deal.userId !== userId) {
      return handleError("Недостаточно прав");
    }

    const safeamountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);


    const updatedDeal = await prisma.retail.update({
      where: { id: deal.id },
      data: {
        ...dealData as RetailResponse,
        userId,
        dateRequest: new Date(),
        amountCP: safeamountCP,
        delta: safeDelta,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...rest } = updatedDeal;

    const formattedDeal = {
      ...rest,
      amountCP: rest.amountCP.toString(),
      delta: rest.delta.toString(), // Преобразуем Decimal в строку
    };

    return formattedDeal;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};



/* Удалить проект */
export const deleteProject = async (
  dealId: string,
  idDealOwner: string,
  type: string
) => {
  try {
    await handleAuthorization();

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
      return handleError("Недостаточно прав");
    }

    switch (type) {
      case DealType.PROJECT:
        await prisma.project.delete({
          where: { id: dealId, userId: idDealOwner },
        });
        break;
      case DealType.RETAIL:
        await prisma.retail.delete({
          where: { id: dealId, userId: idDealOwner },
        });
        break;
    }

    return { data: null, message, error: false };

  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getProjectsUser = async (
  idProjectOwner: string
): Promise<ProjectResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if(!user) {
      return handleError("Пользователь не найден")
    }

    if (!idProjectOwner) {
      return handleError("Недостаточно данных");
    }

    if (userId === idProjectOwner) {
      const projects = await prisma.project.findMany({
        where: { userId: idProjectOwner },
      });

      const formattedProjects = projects.map((project) => ({
        ...project,
        amountCP: project.amountCP.toString(),
        amountWork: project.amountWork.toString(),
        amountPurchase: project.amountPurchase.toString(),
        delta: project.delta.toString(),
      }));

      return formattedProjects;
    }

    await checkUserPermissionByRole(user, [PrismaPermissionsMap.VIEW_USER_REPORT]);

    const deals = await prisma.project.findMany({
      where: { userId: idProjectOwner },
    });

    if (!deals.length) {
      return [];
    }

    const formattedDeals = deals.map((deals) => ({
      ...deals,
      amountCP: deals.amountCP.toString(),
      amountWork: deals.amountWork.toString(),
      amountPurchase: deals.amountPurchase.toString(),
      delta: deals.delta.toString(),
    }));

    return formattedDeals;
  } catch (error) {
    console.error(error);
    handleError((error as Error).message);
    return null;
  }
};


export const getRetailsUser = async (
  idDealOwner: string
): Promise<RetailResponse[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if(!user) {
      return handleError("Пользователь не найден")
    }

    if (!idDealOwner) {
      return handleError("Недостаточно данных");
    }

    if (userId === idDealOwner) {
      const retails = await prisma.retail.findMany({
        where: { userId: idDealOwner },
      });

      const formattedDeal = retails.map((deal) => ({
        ...deal,
        amountCP: deal.amountCP.toString(),
        delta: deal.delta.toString(),
      }));

      return formattedDeal;
    }

    await checkUserPermissionByRole(user, [PrismaPermissionsMap.VIEW_USER_REPORT]);

    const retails = await prisma.retail.findMany({
      where: { userId: idDealOwner },
    });

    if (!retails.length) {
      return [];
    }

    const formattedDeals = retails.map((deal) => ({
      ...deal,
      amountCP: deal.amountCP.toString(),
      delta: deal.delta.toString(),
    }));

    return formattedDeals;
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

    if (!user) {
      return handleError("Пользователь не найден");
    }

    const permissionError = await checkUserPermissionByRole(
      user,
      [PrismaPermissionsMap.VIEW_UNION_REPORT]
    );

    if (permissionError) return permissionError;

    const deals = await prisma.project.findMany({
      where: {
        user: {
          departmentId: user.departmentId, // Фильтрация через связанного пользователя
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        }, // Включаем данные владельца проекта
      },
    });

    const formattedDeals = deals.map((deal) => ({
      ...deal,
      user: deal.user.username,
      amountCP: deal.amountCP.toString(), // Преобразуем Decimal в строку
      amountWork: deal.amountWork.toString(), // Преобразуем Decimal в строку
      amountPurchase: deal.amountPurchase.toString(),
      delta: deal.delta.toString(), // Преобразуем Decimal в строку
    }));

    return formattedDeals;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


export const getAllRetailByDepartment = async (): Promise<
  RetailResponse[]
> => {
  try {
    const { user } = await handleAuthorization();

    if (!user) {
      return handleError("Пользователь не найден");
    }

    const permissionError = await checkUserPermissionByRole(
      user,
      [PrismaPermissionsMap.VIEW_UNION_REPORT]
    );

    if (permissionError) return permissionError;

    const deals = await prisma.retail.findMany({
      where: {
        user: {
          departmentId: user.departmentId, // Фильтрация через связанного пользователя
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        }, // Включаем данные владельца проекта
      },
    });

    const formattedDeals = deals.map((deal) => ({
      ...deal,
      user: deal.user.username,
      amountCP: deal.amountCP.toString(), // Преобразуем Decimal в строку
      delta: deal.delta.toString(), // Преобразуем Decimal в строку
    }));

    return formattedDeals;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

