"use server";

import { DealType, PermissionEnum, Prisma } from "@prisma/client";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import { AllStatusKeys } from "../lib/constants";
import {
  Contact,
  ProjectResponse,
  ProjectResponseWithContactsAndFiles,
  RetailResponse,
  RetailResponseWithContactsAndFiles,
} from "../types";

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
  const data = await handleAuthorization();

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
): Promise<ProjectResponseWithContactsAndFiles | null> => {
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
      include: {
        additionalContacts: true,
      },
    });

    if (!deal) {
      return null;
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId }, // Фильтруем по dealId
    });

    const formattedProject = {
      ...deal,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "", // Преобразуем Decimal в строку
      amountWork: deal.amountWork ? deal.amountWork.toString() : "",
      amountPurchase: deal.amountPurchase ? deal.amountPurchase.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      dealFiles,
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
): Promise<RetailResponseWithContactsAndFiles | null> => {
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
      include: {
        additionalContacts: true,
      },
    });

    if (!deal) {
      return null;
    }

    const dealFiles = await prisma.dealFile.findMany({
      where: { dealId: dealId }, // Фильтруем по dealId
    });

    const formattedRetail = {
      ...deal,
      amountCP: deal.amountCP ? deal.amountCP.toString() : "",
      delta: deal.delta ? deal.delta.toString() : "",
      dealFiles,
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
    const { userId } = await checkAuthAndDataFill(data);

    const {
      amountCP,
      amountPurchase,
      amountWork,
      delta,
      contacts,
      ...dealData
    } = data;

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
        additionalContacts: {
          create: (contacts as Contact[]).map((contact) => ({
            name: contact.name ?? "",
            phone: contact.phone ?? null,
            email: contact.email ?? null,
            position: contact.position ?? null,
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

export const createRetail = async (data: RetailWithoutId) => {
  try {
    if (!data) {
      return handleError("Ошибка: data не переданы в createProject");
    }
    const { userId } = await checkAuthAndDataFill(data);

    const { amountCP, delta, contacts, ...dealData } = data;

    const safeamountCP = new Prisma.Decimal(amountCP as string);
    const safeDelta = new Prisma.Decimal(delta as string);

    const newDeal = await prisma.retail.create({
      data: {
        ...(dealData as RetailResponse),
        userId,
        amountCP: safeamountCP,
        delta: safeDelta,
        additionalContacts: {
          create: (contacts as Contact[]).map((contact) => ({
            name: contact.name ?? "",
            phone: contact.phone ?? null,
            email: contact.email ?? null,
            position: contact.position ?? null,
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

/* Обновить проект */
export const updateProject = async (
  data: ProjectWithoutDateCreateAndUpdate
) => {
  try {
    const { userId, user } = await checkAuthAndDataFill(data);
    const {
      id,
      amountCP,
      amountPurchase,
      amountWork,
      delta,
      contacts,
      ...dealData
    } = data;

    const deal = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        additionalContacts: true, // Включаем контакты проекта
      },
    });

    if (!deal) {
      return [];
    }

    const isOwner = deal.userId === userId;

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
        userId: deal.userId,
        amountCP: safeAmountCP,
        delta: safeDelta,
        amountWork: safeAmountWork,
        amountPurchase: safeAmountPurchase,
      },
    });

    // Если контакты переданы, делаем работу с ними
    // Если контакты переданы, делаем работу с ними
    if (contacts && (contacts as Contact[]).length > 0) {
      // Удаление старых контактов
      await prisma.additionalContact.deleteMany({
        where: {
          projects: {
            some: { id: updatedDeal.id }, // Удаляем все старые контакты для текущего проекта
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
            some: { id: updatedDeal.id }, // Удаляем все старые контакты для текущего проекта
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

    if (!finalDeal) return [];

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

export const updateRetail = async (data: RetailWithoutDateCreateAndUpdate) => {
  try {
    const { userId, user } = await checkAuthAndDataFill(data);
    const { id, amountCP, delta, contacts, ...dealData } = data;

    const deal = await prisma.retail.findUnique({
      where: { id: id as string },
      include: {
        additionalContacts: true, // Включаем контакты проекта
      },
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
        ...dealData,
        userId: deal.userId,
        amountCP: safeAmountCP,
        delta: safeDelta,
      },
    });

    if (contacts && (contacts as Contact[]).length > 0) {
      // Удаление старых контактов
      await prisma.additionalContact.deleteMany({
        where: {
          retails: {
            some: { id: updatedDeal.id }, // Удаляем все старые контакты для текущего проекта
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
          retails: {
            some: { id: updatedDeal.id }, // Удаляем все старые контакты для текущего проекта
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

    if (!finalDeal) return [];

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
        }))
      : [];
  } catch (error) {
    console.error(error);
    handleError((error as Error).message);
    return null;
  }
};

export const getAllProjectsByDepartment = async (
  departmentId?: string | undefined
): Promise<ProjectResponse[]> => {
  try {
    const { user } = await handleAuthorization();

    await checkUserPermissionByRole(user!, [PermissionEnum.VIEW_UNION_REPORT]);

    const departmentIdValue =
      departmentId !== undefined ? +departmentId : +user!.departmentId;

    const deals = await prisma.project.findMany({
      where: {
        user: {
          departmentId: departmentIdValue,
        },
      },
      include: {
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
  departmentId?: string | undefined
): Promise<RetailResponse[]> => {
  try {
    const { user } = await handleAuthorization();

    const permissionError = await checkUserPermissionByRole(user!, [
      PermissionEnum.VIEW_UNION_REPORT,
    ]);

    if (permissionError) return permissionError;
    const departmentIdValue =
      departmentId !== undefined ? +departmentId : +user!.departmentId;

    const deals = await prisma.retail.findMany({
      where: {
        user: {
          departmentId: departmentIdValue,
        },
      },
      include: {
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
export const getAllDealsRequestSourceByDepartment = async (
  departmentId: number
): Promise<DealsListWithResource> => {
  try {
    const { user } = await handleAuthorization();

    const permissionError = await checkUserPermissionByRole(user!, [
      PermissionEnum.VIEW_UNION_REPORT,
    ]);

    if (permissionError) return permissionError;

    const retailsRequestResorce = await prisma.retail.findMany({
      where: {
        user: {
          departmentId: departmentId, // Фильтрация по связанному пользователю
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
          departmentId: departmentId, // Фильтрация по связанному пользователю
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

// /* Удалить проект */

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

    if (deal.userId !== idDealOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.DEAL_MANAGEMENT]);
    }

    // Собираем ID контактов
    contactIdsToCheck = deal.additionalContacts.map((c) => c.id);

    // Удаляем связи
    await prisma.$transaction(async (tx) => {
      if (type === DealType.PROJECT) {
        await tx.project.update({
          where: { id: dealId },
          data: { additionalContacts: { set: [] } },
        });
        await tx.project.delete({ where: { id: dealId } });
      } else {
        await tx.retail.update({
          where: { id: dealId },
          data: { additionalContacts: { set: [] } },
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

    return { data: null, message, error: false };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
