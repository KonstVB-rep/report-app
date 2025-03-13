"use server";

import prisma from "@/prisma/db/prisma-client";
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { findUserByEmail } from "@/app/api/utils/findUserByEmail";
import bcrypt from "bcrypt";
import { DepartmentEnum, Role, User } from "@prisma/client";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { handleError } from "@/shared/api/handleError";
import { DepartmentTypeName, UserRequest, UserResponse, UserWithdepartmentName } from "../types";

type RequiredFields = keyof UserRequest;
const requiredFields: RequiredFields[] = [
  "username",
  "user_password",
  "position",
  "department",
  "role",
  "email",
];

const requiredFieldsForEditForm: RequiredFields[] = [
  "username",
  "position",
  "department",
  "role",
  "email",
];

interface Response<T> {
  error: boolean;
  message: string | null;
  data: T | null;
}

export const checkFormData = async (
  dataObject: UserRequest,
  requiredFields: (keyof UserRequest)[]
) => {
  for (const field of requiredFields) {
    if (
      !(field in dataObject) ||
      dataObject[`${field}`] === null ||
      dataObject[`${field}`] === "" ||
      dataObject === undefined
    ) {
      throw new Error(`Отсутствует или пустое поле: ${field}`);
    }
  }
  return dataObject;
};

export const createUser = async (
  dataUser: UserRequest
): Promise<UserResponse | undefined> => {
  try {
    const { department, ...userData } = await checkFormData(
      dataUser,
      requiredFields
    );

    const dataAuthUser = await handleAuthorization();

    const { user, userId } = dataAuthUser!;
    if (user)
      await checkUserPermissionByRole(userId, user.role, user.departmentId);

    const existingUser: User | null = await findUserByEmail(
      userData.email as string
    );

    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const password = userData.user_password!.trim() as string;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Получаем департамент по имени
    const departmentName = department as DepartmentEnum;

    const departmentTarget = await prisma.department.findUnique({
      where: { name: departmentName },
    });

    if (!departmentTarget) {
      throw new Error(`Департамент с именем ${department} не найден`);
    }

    // Создаем нового пользователя и связываем его с департаментом по departmentId
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        departmentId: departmentTarget.id, // Указываем найденный departmentId
        username: userData.username!.toLowerCase().trim(),
        position: userData.position!.toLowerCase().trim(),
        user_password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        departmentId: true,
        position: true,
        phone: true,
      },
    });

    if (userData.role === Role.DIRECTOR) {
      const existingDirector = await prisma.department.findUnique({
        where: { id: departmentTarget.id },
        select: { directorId: true },
      });

      if (existingDirector?.directorId) {
        console.warn(
          `Внимание: Департамент ${departmentTarget.name} уже имеет директора.`
        );
        return handleError(
          `Департамент ${departmentTarget.name} уже имеет руководителя.`
        );
      }

      // Обновляем департамент, чтобы назначить нового директора
      await prisma.department.update({
        where: { id: departmentTarget.id },
        data: { directorId: newUser.id },
      });
    }

    return newUser;
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "string"
        ? error
        : (error as Error).message || "Ошибка при создании пользователя";
    handleError(errorMessage);
  }
};

export const getUser = async (
  targetUserId: string
): Promise<(User & { departmentName: string }) | undefined> => {
  try {
    const { user, userId } = await handleAuthorization();

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!targetUser) return handleError("Пользователь не найден");

    if (targetUserId !== userId && user) {
      await checkUserPermissionByRole(user.id, user.role, user.departmentId);
    }

    const lastSession = await prisma.userLogin.findFirst({
      where: { userId: targetUserId },
      orderBy: { loginAt: "desc" }, 
      select: { loginAt: true },
    });

    if(lastSession) {
      targetUser.lastlogin = lastSession?.loginAt;
    }

    const userWithDepartmentName = {
      ...targetUser,
      departmentName: targetUser!.department?.name || null, 
    };

    return userWithDepartmentName;
  } catch (error) {
    console.error("Ошибка в getUser:", error);
    throw error;
  }
};

export const getUserShort = async (
  targetUserId: string
): Promise<UserWithdepartmentName | undefined> => {
  try {
    const { user, userId } = await handleAuthorization();

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        position: true,
        departmentId: true, // Выбираем ID департамента, но не сам объект
        role: true,
        department: {
          select: {
            name: true, // Имя департамента
          },
        },
      },
    });
    

    if (!targetUser) return handleError("Пользователь не найден");

    if (targetUserId !== userId && user) {
      await checkUserPermissionByRole(user.id, user.role, user.departmentId);
    }

    const userWithDepartmentName = {
      ...targetUser,
      departmentName: targetUser!.department?.name as DepartmentTypeName || null, 
    };

    return userWithDepartmentName;
  } catch (error) {
    console.error("Ошибка в getUser:", error);
    throw error;
  }
};


export const deleteUser = async (
  deletedUserId: string
): Promise<Response<null>> => {
  try {
    const { user, userId } = await handleAuthorization();

    if (user)
      await checkUserPermissionByRole(userId, user.role, user.departmentId);

    const person = await prisma.user.findUnique({
      where: { id: deletedUserId },
    });

    if (!person)
      return { error: true, message: "Пользователь не найден", data: null };

    await prisma.user.delete({ where: { id: deletedUserId } });
    return { error: false, message: "Пользователь успешно удален", data: null };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Ошибка при удалении пользователя",
      data: null,
    };
  }
};

export const updateUser = async (
  dataUser: UserRequest
): Promise<UserResponse | undefined> => {
  try {
    const { department, user_password, ...userData } = await checkFormData(
      dataUser,
      requiredFieldsForEditForm
    );

    const { user, userId } = await handleAuthorization();

    if (user)
      await checkUserPermissionByRole(userId, user.role, user.departmentId);

    const person = await prisma.user.findUnique({
      where: { email: userData.email as string },
    });

    if (!person) return handleError("Пользователь не найден");

    let departmentId = person.departmentId; // Текущий департамент

    if (department) {
      // Ищем новый департамент по имени
      const newDepartment = await prisma.department.findUnique({
        where: { name: department as DepartmentEnum },
      });

      if (!newDepartment) {
        return handleError(`Департамент с именем ${department} не найден`);
      }

      departmentId = newDepartment.id; // Обновляем depId
    }

    const password = user_password?.trim();

    const updatedData = { ...person, ...userData };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.user_password = hashedPassword;
    }

    const updatedEmployee = await prisma.user.update({
      where: { email: userData.email as string },
      data: {
        ...updatedData,
        departmentId,
        username: updatedData.username!.toLowerCase().trim(),
        position: updatedData.position!.toLowerCase().trim(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        departmentId: true,
        position: true,
        phone: true,
      },
    });

    return updatedEmployee;
  } catch (error) {
    console.error(error);
    return handleError("Ошибка при обновлении пользователя");
  }
};

export const getAllUsersByDepartment = async (id: number): Promise<User[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    // Утверждаем, что user не может быть null
    if (!user) {
      handleError("Пользователь не найден");
    }

    await checkUserPermissionByRole(userId, user!.role, user!.departmentId);

    const users = await prisma.user.findMany({
      where: { departmentId: Number(id) },
    });

    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении данных");
  }
};

export const getAllUsersByDepartmentNameAndId = async (id: number): Promise<Record<string, string> | null> => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    // Утверждаем, что user не может быть null
    if (!user) {
      handleError("Пользователь не найден");
    }

    await checkUserPermissionByRole(userId, user!.role, user!.departmentId);

    const users = await prisma.user.findMany({
      where: { departmentId: Number(id) }, select: {
        id: true,
        username: true,
      },
    });
    const transform = users.reduce((acc, user) => {
      acc[user.id] = user.username; // исправлено
      return acc;
    }, {} as Record<string, string>); // добавлен явный тип
      
    return transform;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении данных");
  }
};
