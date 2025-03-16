"use server";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { handleError } from "@/shared/api/handleError";
import { DirectionProject, Prisma } from "@prisma/client";
import { ProjectResponse } from "../types";
import prisma from "@/prisma/prisma-client";

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

type ProjectWithoutId = Omit<ProjectWithoutDateCreateAndUpdate, "id"> & {
  direction: DirectionProject;
};

const checkAuthAndDataFill = async (projectData: ProjectWithoutId) => {
  const { userId } = await handleAuthorization();

  for (const field of requiredFields as (keyof ProjectWithoutId)[]) {
    if (!projectData[field]) {
      return handleError(`Отсутствует поле: ${field}`);
    }
  }
  console.log(userId, "1111111111111111111111111");
  return userId;
};

/* Получить проект */
export const getProjectById = async (
  projectId: string,
  idProjectOwner: string
): Promise<ProjectResponse | null> => {
  try {
    const data = await handleAuthorization();

    if (!data) return handleError("Ошибка авторизации");

    const { user, userId } = data!;

    if (!projectId || !idProjectOwner) {
      return handleError("Недостаточно данных");
    }

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, departmentId: true },
    });

    if (!userOwnerProject) {
      return handleError("Пользователь не найден");
    }

    const isOwner = userId === idProjectOwner;

    if (!isOwner && user) {
      await checkUserPermissionByRole(userId!, user.role, user.departmentId);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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

export const createProject = async (data: ProjectWithoutId) => {
  console.log("data", data);
  try {
    if (!data) {
      return handleError("Ошибка: data не переданы в createProject");
    }
    const userId = await checkAuthAndDataFill(data);

    console.log("userId", userId);

    const { amountCP, amountPurchase, amountWork, delta, ...projectData } =
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

    // const safeamountCP = isNaN(parseFloat(amountCP))
    //   ? new Prisma.Decimal(0)
    //   : new Prisma.Decimal(parseFloat(amountCP));

    // const safeDelta = isNaN(parseFloat(delta))
    //   ? new Prisma.Decimal(0)
    //   : new Prisma.Decimal(parseFloat(delta));

    // const safeamountWork = isNaN(parseFloat(amountWork))
    //   ? new Prisma.Decimal(0)
    //   : new Prisma.Decimal(parseFloat(amountWork));

    // const safeamountPurchase = isNaN(parseFloat(amountPurchase))
    //   ? new Prisma.Decimal(0)
    //   : new Prisma.Decimal(parseFloat(amountPurchase));
    const safeamountCP = new Prisma.Decimal(amountCP.toString());
    const safeDelta = new Prisma.Decimal(delta.toString());
    const safeamountWork = new Prisma.Decimal(amountWork.toString());
    const safeamountPurchase = new Prisma.Decimal(amountPurchase.toString());

    console.log(
      {
        ...projectData,
        userId,
        dateRequest: new Date(),
        amountCP: safeamountCP,
        delta: safeDelta,
        amountWork: safeamountWork,
        amountPurchase: safeamountPurchase,
      },
      "projectData"
    );

    const newProject = await prisma.project.create({
      data: {
        ...projectData,
        userId,
        dateRequest: new Date(),
        amountCP: safeamountCP,
        delta: safeDelta,
        amountWork: safeamountWork,
        amountPurchase: safeamountPurchase,
      },
    });

    const formatteProject = {
      ...newProject,
      amountCP: safeamountCP.toString(),
      amountWork: safeamountWork.toString(),
      amountPurchase: safeamountPurchase.toString(),
      delta: safeDelta.toString(),
    };

    return formatteProject;
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
    const { id, ...projectData } = data;

    const project = await prisma.project.findUnique({ where: { id: id } });

    if (!project) {
      return [];
    }

    if (project.userId !== userId) {
      return handleError("Недостаточно прав");
    }
    const safeamountCP = isNaN(parseFloat(projectData.amountCP))
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(parseFloat(projectData.amountCP));

    const safeDelta = isNaN(parseFloat(projectData.delta))
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(parseFloat(projectData.delta));

    const safeamountWork = isNaN(parseFloat(projectData.amountWork))
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(parseFloat(projectData.amountWork));

    const safeamountPurchase = isNaN(parseFloat(projectData.amountPurchase))
      ? new Prisma.Decimal(0)
      : new Prisma.Decimal(parseFloat(projectData.amountPurchase));

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        ...projectData,
        userId,
        dateRequest: new Date(),
        amountCP: safeamountCP,
        delta: safeDelta,
        amountWork: safeamountWork,
        amountPurchase: safeamountPurchase,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...rest } = updatedProject;

    const formatteProject = {
      ...rest,
      amountCP: rest.amountCP.toString(), // Преобразуем Decimal в строку
      amountWork: rest.amountWork.toString(), // Преобразуем Decimal в строку
      amountPurchase: rest.amountPurchase.toString(),
      delta: rest.delta.toString(), // Преобразуем Decimal в строку
    };

    return formatteProject;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

/* Удалить проект */
export const deleteProject = async (
  projectId: string,
  idProjectOwner: string
) => {
  try {
    await handleAuthorization();

    if (!projectId || !idProjectOwner) {
      return handleError("Недостаточно данных");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true },
    });

    if (!project) {
      return [];
    }

    if (project.userId !== idProjectOwner) {
      return handleError("Недостаточно прав");
    }

    await prisma.project.delete({
      where: { id: projectId, userId: idProjectOwner },
    });

    return { data: null, message: "Проект удален", error: false };
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

    if (!idProjectOwner) {
      handleError("Недостаточно данных");
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

    await checkUserPermissionByRole(userId!, user!.role, user!.departmentId);

    const projects = await prisma.project.findMany({
      where: { userId: idProjectOwner },
    });

    if (!projects.length) {
      return [];
    }

    const formattedProjects = projects.map((project) => ({
      ...project,
      amountCP: project.amountCP.toString(),
      amountWork: project.amountWork.toString(),
      amountPurchase: project.amountPurchase.toString(),
      delta: project.delta.toString(),
    }));

    return formattedProjects;
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
    const { user, userId } = await handleAuthorization();

    if (!user) {
      return handleError("Пользователь не найден");
    }

    const permissionError = await checkUserPermissionByRole(
      userId!,
      user.role,
      user.departmentId
    );

    if (permissionError) return permissionError;

    const projects = await prisma.project.findMany({
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

    const formattedProjects = projects.map((project) => ({
      ...project,
      user: project.user.username,
      amountCP: project.amountCP.toString(), // Преобразуем Decimal в строку
      amountWork: project.amountWork.toString(), // Преобразуем Decimal в строку
      amountPurchase: project.amountPurchase.toString(),
      delta: project.delta.toString(), // Преобразуем Decimal в строку
    }));

    return formattedProjects;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
