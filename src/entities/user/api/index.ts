"use server";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { findUserByEmail } from "@/app/api/utils/findUserByEmail";
import bcrypt from "bcrypt";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { handleError } from "@/shared/api/handleError";
import {
  DepartmentTypeName,
  RoleType,
  UserRequest,
  UserResponse,
  UserWithdepartmentName,
} from "../types";
import { DepartmentEnum, Role, User } from "@prisma/client";
import prisma from "@/prisma/prisma-client";
import { PrismaPermissionsMap } from "../model/objectTypes";

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

// export const createUser = async (
//   dataUser: UserRequest
// ): Promise<UserResponse | undefined> => {
//   try {
//     const { department,permissions, ...userData } = await checkFormData(
//       dataUser,
//       requiredFields
//     );

//     const dataAuthUser = await handleAuthorization();

//     const { user } = dataAuthUser!;
//     if (user)
//       await checkUserPermissionByRole(user, [PrismaPermissionsMap.USER_MANAGEMENT]);

//     const existingUser: User | null = await findUserByEmail(
//       userData.email as string
//     );

//     if (existingUser) {
//       throw new Error("Пользователь с таким email уже существует");
//     }

//     const password = userData.user_password!.trim() as string;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Получаем департамент по имени
//     const departmentName = department as DepartmentEnum;

//     const departmentTarget = await prisma.department.findUnique({
//       where: { name: departmentName },
//     });

//     if (!departmentTarget) {
//       throw new Error(`Департамент с именем ${department} не найден`);
//     }

//     // Создаем нового пользователя и связываем его с департаментом по departmentId
//     const newUser = await prisma.user.create({
//       data: {
//         ...userData,
//         role: userData.role as RoleType,
//         departmentId: departmentTarget.id, // Указываем найденный departmentId
//         username: userData.username!.toLowerCase().trim(),
//         position: userData.position!.toLowerCase().trim(),
//         user_password: hashedPassword,
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         departmentId: true,
//         position: true,
//         phone: true,
//       },
//     });

//     if (userData.role === Role.DIRECTOR) {
//       const existingDirector = await prisma.department.findUnique({
//         where: { id: departmentTarget.id },
//         select: { directorId: true },
//       });

//       if (existingDirector?.directorId) {
//         console.warn(
//           `Внимание: Департамент ${departmentTarget.name} уже имеет директора.`
//         );
//         return handleError(
//           `Департамент ${departmentTarget.name} уже имеет руководителя.`
//         );
//       }

//       // Обновляем департамент, чтобы назначить нового директора
//       await prisma.department.update({
//         where: { id: departmentTarget.id },
//         data: { directorId: newUser.id },
//       });
//     }

//     if (permissions && permissions.length > 0) {
//       const userPermissions = permissions.map(permission => ({
//         userId: newUser.id,
//         permission: permission as PermissionEnum, // Преобразуем в тип Permission
//       }));

//       // Создаем записи в таблице userPermission для каждого разрешения
//       await prisma.userPermission.createMany({
//         data: userPermissions,
//       });
//     }

//     return newUser;
//   } catch (error) {
//     console.error(error);
//     const errorMessage =
//       typeof error === "string" ? error : "Ошибка при создании пользователя";
//     handleError(errorMessage);
//   }
// };


// export const generatePermission =async () => {
//   await prisma.permission.createMany({
//     data: [
//       { name: "VIEW_USER_REPORT", description: "Просмотр отчета пользователя" },
//       { name: "VIEW_UNION_REPORT", description: "Просмотр сводной таблицы" },
//       { name: "DOWNLOAD_REPORTS", description: "Скачать отчет" },
//       { name: "USER_MANAGEMENT", description: "Управление пользователями" },
//     ],
//   });
// }

export const createUser = async (dataUser: UserRequest): Promise<UserResponse | undefined> => {
  try {
    const { department, permissions, ...userData } = await checkFormData(dataUser, requiredFields);
    const dataAuthUser = await handleAuthorization();
    const { user } = dataAuthUser!;

    if (user) {
      await checkUserPermissionByRole(user, [PrismaPermissionsMap.USER_MANAGEMENT]);
    }

    const existingUser = await findUserByEmail(userData.email as string);
    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const hashedPassword = await bcrypt.hash(userData.user_password!.trim(), 10);
    const departmentTarget = await prisma.department.findUnique({ where: { name: department as DepartmentEnum } });

    if (!departmentTarget) throw new Error(`Департамент ${department} не найден`);

    // Создание пользователя
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        role: userData.role as RoleType,
        departmentId: departmentTarget.id,
        username: userData.username!.toLowerCase().trim(),
        position: userData.position!.toLowerCase().trim(),
        user_password: hashedPassword,
      },
      select: { id: true, username: true, email: true, role: true, departmentId: true, position: true, phone: true },
    });

    // Добавление разрешений пользователю
    if (permissions && permissions.length > 0) {
      const permissionRecords = await prisma.permission.findMany({
        where: { name: { in: permissions } }, // Получаем ID разрешений из Permission
        select: { id: true, name: true },
      });

      const userPermissions = permissionRecords.map(permission => ({
        userId: newUser.id,
        permissionId: permission.id,
      }));

      await prisma.userPermission.createMany({
        data: userPermissions,
      });
    }

    return newUser;
  } catch (error) {
    console.error(error);
    handleError(typeof error === "string" ? error : "Ошибка при создании пользователя");
  }
};

// export const updateUser = async (
//   dataUser: UserRequest
// ): Promise<UserResponse | undefined> => {
//   try {
//     const { department, user_password,permissions, ...userData } = await checkFormData(
//       dataUser,
//       requiredFieldsForEditForm
//     );

//     const { user } = await handleAuthorization();

//     if (user)
//       await checkUserPermissionByRole(user, [PrismaPermissionsMap
// .USER_MANAGEMENT]);

//     const person = await prisma.user.findUnique({
//       where: { email: userData.email as string },
//     });

//     if (!person) return handleError("Пользователь не найден");

//     let departmentId = person.departmentId; // Текущий департамент

//     if (department) {
//       // Ищем новый департамент по имени
//       const newDepartment = await prisma.department.findUnique({
//         where: { name: department as DepartmentEnum },
//       });

//       if (!newDepartment) {
//         return handleError(`Департамент с именем ${department} не найден`);
//       }

//       departmentId = newDepartment.id; // Обновляем depId
//     }

//     const password = user_password?.trim();

//     const updatedData = { ...person, ...userData };

//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updatedData.user_password = hashedPassword;
//     }

//     const updateUser = await prisma.user.update({
//       where: { email: userData.email as string },
//       data: {
//         ...updatedData,
//         role: updatedData.role as Role,
//         departmentId,
//         username: updatedData.username!.toLowerCase().trim(),
//         position: updatedData.position!.toLowerCase().trim(),
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         departmentId: true,
//         position: true,
//         phone: true,
//       },
//     });

//     if (permissions && permissions.length > 0) {
//       const userPermissions = permissions.map(permission => ({
//         userId: updateUser.id,
//         permission: permission as PermissionEnum, // Преобразуем в тип Permission
//       }));

//       // Создаем записи в таблице userPermission для каждого разрешения
//       await prisma.userPermission.createMany({
//         data: userPermissions,
//       });
//     }

//     return updateUser;
//   } catch (error) {
//     console.error(error);
//     return handleError((error as Error).message);
//   }
// };


export const updateUser = async (dataUser: UserRequest): Promise<UserResponse | undefined> => {
  try {
    const { department, user_password, permissions, ...userData } = await checkFormData(dataUser, requiredFieldsForEditForm);
    const { user } = await handleAuthorization();

    if (user) {
      await checkUserPermissionByRole(user, [PrismaPermissionsMap.USER_MANAGEMENT]);
    }

    const person = await prisma.user.findUnique({ where: { email: userData.email as string } });
    if (!person) return handleError("Пользователь не найден");

    let departmentId = person.departmentId;
    if (department) {
      const newDepartment = await prisma.department.findUnique({ where: { name: department as DepartmentEnum } });
      if (!newDepartment) return handleError(`Департамент ${department} не найден`);
      departmentId = newDepartment.id;
    }

    const updatedData = { ...person, ...userData };
    if (user_password) {
      updatedData.user_password = await bcrypt.hash(user_password.trim(), 10);
    }

    // Обновляем пользователя
    const updatedUser = await prisma.user.update({
      where: { email: userData.email as string },
      data: {
        ...updatedData,
        role: updatedData.role as Role,
        departmentId,
        username: updatedData.username!.toLowerCase().trim(),
        position: updatedData.position!.toLowerCase().trim(),
      },
      select: { id: true, username: true, email: true, role: true, departmentId: true, position: true, phone: true },
    });

    // Обновляем права пользователя
    if (permissions) {
      // Удаляем старые разрешения
      await prisma.userPermission.deleteMany({
        where: { userId: updatedUser.id },
      });

      if (permissions.length > 0) {
        const permissionRecords = await prisma.permission.findMany({
          where: { name: { in: permissions } },
          select: { id: true, name: true },
        });

        const userPermissions = permissionRecords.map(permission => ({
          userId: updatedUser.id,
          permissionId: permission.id,
        }));

        await prisma.userPermission.createMany({
          data: userPermissions,
        });
      }
    }

    return updatedUser;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
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
        permissions: {
          include: {
            permission: {
              select: { name: true }, // Получаем только название разрешения (PermissionEnum)
            },
          },
        },
      },
    });

    if (!targetUser) return handleError("Пользователь не найден");

    if (targetUserId !== userId && user) {
      await checkUserPermissionByRole(user);
    }

    const lastSession = await prisma.userLogin.findFirst({
      where: { userId: targetUserId },
      orderBy: { loginAt: "desc" },
      select: { loginAt: true },
    });

    if (lastSession) {
      targetUser.lastlogin = lastSession?.loginAt;
    }

    const userPermissions = targetUser.permissions.map((p) => p.permission.name);
    const userWithDepartmentNameWithPermissions = {
      ...targetUser,
      departmentName: targetUser!.department?.name || null,
      permissions: userPermissions, 
    };

    return userWithDepartmentNameWithPermissions;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
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
      await checkUserPermissionByRole(user);
    }

    const userWithDepartmentName = {
      ...targetUser,
      departmentName:
        (targetUser!.department?.name as DepartmentTypeName) || null,
    };

    return userWithDepartmentName;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const deleteUser = async (
  deletedUserId: string
): Promise<Response<null>> => {
  try {
    const { user } = await handleAuthorization();

    if (user)
      await checkUserPermissionByRole(user, [PrismaPermissionsMap
.USER_MANAGEMENT]);

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



export const getAllUsersByDepartment = async (
  id: number
): Promise<User[] | null> => {
  try {
    const data = await handleAuthorization();
    const { user } = data!;

    if (!user) {
      handleError("Пользователь не найден");
    }

    // await checkUserPermissionByRole(userId, user!.role, user!.departmentId);

    const users = await prisma.user.findMany({
      where: { departmentId: Number(id) },
    });

    return users;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getAllUsersFromFilter = async (
  id: number
): Promise<Record<string, string> | null> => {
  try {
    const data = await handleAuthorization();
    const { user } = data!;

    // Утверждаем, что user не может быть null
    if (!user) {
      return handleError("Пользователь не найден");
    }

    await checkUserPermissionByRole(user, [PrismaPermissionsMap
.VIEW_UNION_REPORT]);

    const users = await prisma.user.findMany({
      where: { departmentId: Number(id) },
      select: {
        id: true,
        username: true,
      },
    });
    const transform = users.reduce((acc, user) => {
      acc[user.id] = user.username; 
      return acc;
    }, {} as Record<string, string>);

    return transform;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
