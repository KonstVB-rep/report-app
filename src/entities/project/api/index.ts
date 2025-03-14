'use server'

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/db/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { Direction, Prisma } from "@prisma/client";
import { Project, ProjectResponse } from "../types";


const requiredFields = [
  "nameObject",
  "direction",
  "comments",
  "contact",
  "project_status",
];

type ProjectWithoutDateCreateAndUpdate = Omit<Project, "createdAt" | "updatedAt"> 

type ProjectWithoutId = Omit<ProjectWithoutDateCreateAndUpdate, "id"> & {
  direction: Direction;
};

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
export const getProjectById = async (projectId: string, idProjectOwner: string): Promise<ProjectResponse | null> => {
  try {
    const data = await handleAuthorization();

    if(!data) return handleError("Ошибка авторизации");

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
      where: { id: projectId }
    });

    if (!project) {
      return handleError("Проект не найден");
    }

    const formattedProject = { ...project, amountCo: project.amountCo.toString(), delta: project.delta.toString() };
    return formattedProject;
  } catch (error) {
    console.error(error);
    return handleError("Ошибка при получении проекта");
  }
};

export const createProject = async (data: ProjectWithoutId) => {
  try {

    if (!data) {
      return handleError("Ошибка: data не переданы в createProject");
    }
    const userId = await checkAuthAndDataFill(data);

    console.log("userId", userId);  

    const {
      ...projectData
    } = data;

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

    const safeAmountCo = isNaN(projectData.amountCo) ? new Prisma.Decimal(0) : new Prisma.Decimal(projectData.amountCo);
    const safeDelta = isNaN(projectData.delta) ? new Prisma.Decimal(0) : new Prisma.Decimal(projectData.delta);


    const newProject = await prisma.project.create({
      data: {
        ...projectData,
        userId,
        dateRequest: new Date(),
        amountCo: safeAmountCo,
        delta: safeDelta,
      },
    });

    const formatteProject = {
      ...newProject,
      amountCo: safeAmountCo.toString(),
      delta: safeDelta.toString(),  
    };

      
    return formatteProject;
    
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "string"
        ? error
        :  "Ошибка при создании проекта";
    handleError(errorMessage);
  }
};

/* Обновить проект */
export const updateProject = async (data: ProjectWithoutDateCreateAndUpdate) => {
  try {
    const userId = await checkAuthAndDataFill(data);
    const {
      id,
      ...projectData
    } = data;

    const project = await prisma.project.findUnique({ where: { id: id } });

    if (!project) {
      return []
    }

    if (project.userId !== userId) {
      return handleError("Недостаточно прав");
    }

    const safeAmountCo = isNaN(projectData.amountCo) ? new Prisma.Decimal(0) : new Prisma.Decimal(projectData.amountCo);
    const safeDelta = isNaN(projectData.delta) ? new Prisma.Decimal(0) : new Prisma.Decimal(projectData.delta);

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        ...projectData,
        userId,
        dateRequest: new Date(),
        amountCo: safeAmountCo,
        delta: safeDelta,
      },
    });
    

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...rest } = updatedProject;

    const formatteProject = {
      ...rest,
      amountCo: rest.amountCo.toString(),  // Преобразуем Decimal в строку
      delta: rest.delta.toString(),  // Преобразуем Decimal в строку
    };

    return formatteProject
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "string"
        ? error
        : "Ошибка при обновлении проекта";
    return handleError(errorMessage);
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
    const errorMessage =
      typeof error === "string"
        ? error
        :  "Ошибка при удалении проекта";
    handleError(errorMessage);
  }
};

export const getProjectsUser = async (idProjectOwner: string) : Promise<ProjectResponse[] | null> => {
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

      const formattedProjects = projects.map(project => ({
        ...project,
        amountCo: project.amountCo.toString(),
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

    const formattedProjects = projects.map(project => ({
      ...project,
      amountCo: project.amountCo.toString(), 
      delta: project.delta.toString(), 
    }));

    return formattedProjects;
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "string"
        ? error
        :  "Ошибка при получении данных";
    handleError(errorMessage);
    return null
  }
};


export const getAllProjectsByDepartment = async () => {
  try {
    const { user, userId} = await handleAuthorization();

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

    const formattedProjects = projects.map(project => ({
      ...project,
      user: project.user.username,
      amountCo: project.amountCo.toString(),  // Преобразуем Decimal в строку
      delta: project.delta.toString(),  // Преобразуем Decimal в строку
    }));

    return formattedProjects
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "string"
        ? error
        :  "Ошибка при получении данных";
    handleError(errorMessage);
  }
};