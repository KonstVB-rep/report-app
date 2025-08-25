"use server";

import {
  Department,
  DepartmentEnum,
  PermissionEnum,
  Role,
  User,
} from "@prisma/client";


import bcrypt from "bcrypt";
import z from "zod";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { findUserByEmail } from "@/app/api/utils/findUserByEmail";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { ActionResponse } from "@/shared/types";


import { userFormSchema } from "../model/schema";
import { DepartmentTypeName, UserFormData, UserRequest } from "../types";

// type RequiredFields = keyof UserRequest;
// const requiredFields: RequiredFields[] = [
//   "username",
//   "user_password",
//   "position",
//   "department",
//   "role",
//   "email",
// ];

// const requiredFieldsForEditForm: RequiredFields[] = [
//   "username",
//   "position",
//   "department",
//   "role",
//   "email",
// ];

export interface ResponseDelUser<T> {
  error: boolean;
  message: string | null;
  data: T | null;
}

const extractFormData = (
  formData: FormData,
  permissions: string[]
): UserFormData => ({
  username: formData.get("username") as string,
  phone: formData.get("phone") as string,
  email: formData.get("email") as string,
  user_password: formData.get("user_password") as string,
  position: formData.get("position") as string,
  department: formData.get("department") as DepartmentTypeName,
  role: formData.get("role") as Role,
  permissions: permissions as PermissionEnum[],
});

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

const safeParseFormData = (
  formData: FormData
): UserFormData | ActionResponse<UserFormData> => {
  const permissionsValue = formData.get("permissions");
  let permissions: string[] = [];

  if (typeof permissionsValue === "string") {
    try {
      permissions = JSON.parse(permissionsValue);
    } catch (error) {
      console.error("Failed to parse permissions JSON:", error);
    }
  }

  const rawData = extractFormData(formData, permissions);

  const { data: dataForm, success, error } = userFormSchema.safeParse(rawData);

  if (!success) {
    console.log(JSON.stringify(permissions), "z.treeifyError(error)");
    return {
      success: false,
      message: "Пожалуйста, исправьте ошибки в форме",
      errors: z.treeifyError(error),
      inputs: {
        ...rawData,
        permissions:
          permissions.length > 0 ? JSON.stringify(permissions) : undefined,
      },
    };
  }

  return {
    ...dataForm,
    department: dataForm.department as DepartmentTypeName,
    role: dataForm.role as Role,
    permissions: dataForm.permissions as PermissionEnum[],
  };
};

const handleDirectorAssignment = async (
  departmentId: number,
  userId: string
) => {
  const existingDirector = await prisma.department.findUnique({
    where: { id: departmentId },
    select: { directorId: true },
  });

  if (existingDirector?.directorId) {
    throw new Error(`Департамент уже имеет руководителя.`);
  }

  await prisma.department.update({
    where: { id: departmentId },
    data: { directorId: userId },
  });
};

const addUserToDb = async (
  dataForm: UserFormData,
  hashedPassword: string,
  departmentId: number
) => {
  return await prisma.user.create({
    data: {
      email: dataForm.email!.toLowerCase().trim(),
      phone: dataForm.phone!.toLowerCase().trim(),
      role: dataForm.role as Role,
      departmentId: departmentId,
      username: dataForm.username!.toLowerCase().trim(),
      position: dataForm.position!.toLowerCase().trim(),
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
};

const assignPermissionsToUser = async (
  userId: string,
  permissions: PermissionEnum[]
) => {
  const permissionRecords = await prisma.permission.findMany({
    where: { name: { in: permissions } },
    select: { id: true, name: true },
  });

  const userPermissions = permissionRecords.map((permission) => ({
    userId: userId,
    permissionId: permission.id,
  }));

  await prisma.userPermission.createMany({
    data: userPermissions,
  });
};

const checkUserPermissions = async (
  requiredPermissions: PermissionEnum[] = []
) => {
  const dataAuthUser = await handleAuthorization();
  if (dataAuthUser?.user && requiredPermissions.length > 0) {
    await checkUserPermissionByRole(dataAuthUser.user, requiredPermissions);
  }
};

// Проверка уникальности email
const checkEmailUnique = async (email: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }
};

// Подготовка пароля
const hashUserPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password.trim(), 10);
};

// Поиск департамента
const findDepartment = async (departmentName: string): Promise<Department> => {
  const department = await prisma.department.findUnique({
    where: { name: departmentName as DepartmentEnum },
  });

  if (!department) {
    throw new Error(`Департамент ${departmentName} не найден`);
  }

  return department;
};

function isUserFormData(
  data: UserFormData | ActionResponse<UserFormData>
): data is UserFormData {
  return (data as UserFormData).email !== undefined;
}

export const createUser = async (
  formData: FormData
): Promise<ActionResponse<UserFormData>> => {
  try {
    const parsedData = safeParseFormData(formData);

    // Проверяем, является ли результат ошибкой
    if (isUserFormData(parsedData)) {
      // Здесь TS понимает, что это точно UserFormData
      await checkUserPermissions([PermissionEnum.USER_MANAGEMENT]);
      await checkEmailUnique(parsedData.email as string);
      const hashedPassword = await hashUserPassword(parsedData.user_password!);
      const departmentTarget = await findDepartment(
        parsedData.department as string
      );

      // Создание пользователя
      const newUser = await addUserToDb(
        {
          ...parsedData,
          role: parsedData.role as Role,
          department: parsedData.department as DepartmentTypeName,
        },
        hashedPassword,
        departmentTarget.id
      );

      if (parsedData.role === Role.DIRECTOR) {
        await handleDirectorAssignment(departmentTarget.id, newUser.id);
      }

      // Добавление разрешений пользователю
      await assignPermissionsToUser(newUser.id, parsedData.permissions || []);
    }

    return {
      success: true,
      message: "Новый пользователь сохранен",
    };
  } catch (error) {
    console.log("Произошла ошибка при сохранении пользователя", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении пользователя",
    };
  }
};

export const updateUser = async (
  formData: FormData
): Promise<ActionResponse<UserFormData>> => {
  try {
    const parsedData = safeParseFormData(formData);

    // Проверяем, является ли результат ошибкой
    if (isUserFormData(parsedData)) {
      await checkUserPermissions([PermissionEnum.USER_MANAGEMENT]);
      await checkEmailUnique(parsedData.email as string);
      const hashedPassword = await hashUserPassword(parsedData.user_password!);
      const departmentTarget = await findDepartment(
        parsedData.department as string
      );

      // Создание пользователя
      const updatedUser = await addUserToDb(
        {
          ...parsedData,
          role: parsedData.role as Role,
          department: parsedData.department as DepartmentTypeName,
        },
        hashedPassword,
        departmentTarget.id
      );
      if (parsedData.role === Role.DIRECTOR) {
        await handleDirectorAssignment(departmentTarget.id, updatedUser.id);
      }

      // Добавление разрешений пользователю
      await assignPermissionsToUser(
        updatedUser.id,
        parsedData.permissions || []
      );
    }

    return {
      success: true,
      message: "Новый пользователь сохранен",
    };
  } catch (error) {
    console.log("Произошла ошибка при сохранении пользователя", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении пользователя",
    };
  }
};

// export const createUser = async (
//   dataUser: UserRequest
// ): Promise<UserResponse | undefined> => {
//   try {
//     const { department, permissions, ...userData } = await checkFormData(
//       dataUser,
//       requiredFields
//     );
//     const dataAuthUser = await handleAuthorization();
//     const { user } = dataAuthUser!;

//     if (user) {
//       await checkUserPermissionByRole(user, [PermissionEnum.USER_MANAGEMENT]);
//     }

//     const existingUser = await findUserByEmail(userData.email as string);
//     if (existingUser) {
//       throw new Error("Пользователь с таким email уже существует");
//     }

//     const hashedPassword = await bcrypt.hash(
//       userData.user_password!.trim(),
//       10
//     );
//     const departmentTarget = await prisma.department.findUnique({
//       where: { name: department as DepartmentEnum },
//     });

//     if (!departmentTarget)
//       throw new Error(`Департамент ${department} не найден`);

//     // Создание пользователя
//     const updatedUser = await prisma.user.create({
//       data: {
//         ...userData,
//         role: userData.role as Role,
//         departmentId: departmentTarget.id,
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
//           `Внимание: Департамент ${departmentTarget.name} уже имеет руководителя.`
//         );
//         return handleError(
//           `Департамент ${departmentTarget.name} уже имеет руководителя.`
//         );
//       }

//       // Обновляем департамент, чтобы назначить нового директора
//       await prisma.department.update({
//         where: { id: departmentTarget.id },
//         data: { directorId: updatedUser.id },
//       });
//     }

//     // Добавление разрешений пользователю
//     if (permissions && permissions.length > 0) {
//       const permissionRecords = await prisma.permission.findMany({
//         where: { name: { in: permissions } }, // Получаем ID разрешений из Permission
//         select: { id: true, name: true },
//       });

//       const userPermissions = permissionRecords.map((permission) => ({
//         userId: updatedUser.id,
//         permissionId: permission.id,
//       }));

//       await prisma.userPermission.createMany({
//         data: userPermissions,
//       });
//     }

//     return updatedUser;
//   } catch (error) {
//     console.error(error);
//     handleError(
//       typeof error === "string" ? error : "Ошибка при создании пользователя"
//     );
//   }
// };

// export const updateUser = async (
//   dataUser: UserRequest
// ): Promise<UserResponse | undefined> => {
//   try {
//     const { department, user_password, permissions, ...userData } =
//       await checkFormData(dataUser, requiredFieldsForEditForm);
//     const { user } = await handleAuthorization();

//     if (user) {
//       await checkUserPermissionByRole(user, [PermissionEnum.USER_MANAGEMENT]);
//     }

//     const person = await prisma.user.findUnique({
//       where: { email: userData.email as string },
//     });
//     if (!person) return handleError("Пользователь не найден");

//     let departmentId = person.departmentId;
//     if (department) {
//       const newDepartment = await prisma.department.findUnique({
//         where: { name: department as DepartmentEnum },
//       });
//       if (!newDepartment)
//         return handleError(`Департамент ${department} не найден`);
//       departmentId = newDepartment.id;
//     }

//     const updatedData = { ...person, ...userData };
//     if (user_password) {
//       updatedData.user_password = await bcrypt.hash(user_password.trim(), 10);
//     }

//     // Обновляем пользователя
//     const updatedUser = await prisma.user.update({
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

//     // Обновляем права пользователя
//     if (permissions) {
//       // Удаляем старые разрешения
//       await prisma.userPermission.deleteMany({
//         where: { userId: updatedUser.id },
//       });

//       if (permissions.length > 0) {
//         const permissionRecords = await prisma.permission.findMany({
//           where: { name: { in: permissions } },
//           select: { id: true, name: true },
//         });

//         const userPermissions = permissionRecords.map((permission) => ({
//           userId: updatedUser.id,
//           permissionId: permission.id,
//         }));

//         await prisma.userPermission.createMany({
//           data: userPermissions,
//         });
//       }
//     }

//     return updatedUser;
//   } catch (error) {
//     console.error(error);
//     return handleError((error as Error).message);
//   }
// };

export const getUser = async (
  targetUserId: string,
  permissions?: PermissionEnum[]
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

    if (
      targetUserId !== userId &&
      user &&
      permissions &&
      permissions.length > 0
    ) {
      await checkUserPermissionByRole(user, permissions);
    }

    const lastSession = await prisma.userLogin.findFirst({
      where: { userId: targetUserId },
      orderBy: { loginAt: "desc" },
      select: { loginAt: true },
    });

    if (lastSession) {
      targetUser.lastlogin = lastSession?.loginAt;
    }

    const userPermissions = targetUser.permissions.map(
      (p) => p.permission.name
    );

    const userWithDepartmentNameWithPermissions = {
      ...targetUser,
      departmentName: targetUser!.department?.name || null,
      permissions: userPermissions,
    };

    return userWithDepartmentNameWithPermissions ?? null;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const deleteUser = async (deletedUserData: {
  userId: string;
}): Promise<ResponseDelUser<null>> => {
  try {
    const { user } = await handleAuthorization();

    if (user)
      await checkUserPermissionByRole(user, [PermissionEnum.USER_MANAGEMENT]);

    const deletedUserId = deletedUserData.userId;

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
