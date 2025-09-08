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

import { userFormEditSchema, userFormSchema } from "../model/schema";
import {
  UserDataBase,
  UserFormData,
  UserFormEditData,
  UserRequest,
} from "../types";

export interface ResponseDelUser<T> {
  error: boolean;
  message: string | null;
  data: T | null;
}

const extractFormData = (
  formData: FormData,
  permissions: string[]
): UserFormData => ({
  ...(formData.get("id") && { id: formData.get("id") as string }),
  username: formData.get("username") as string,
  phone: formData.get("phone") as string,
  email: formData.get("email") as string,
  user_password: formData.get("user_password") as string,
  position: formData.get("position") as string,
  department: formData.get("department") as DepartmentEnum,
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

const safeParseFormData = <T extends UserDataBase>(
  formData: FormData,
  schema: z.ZodType<T>
): T | ActionResponse<T> => {
  const permissionsValue = formData.get("permissions");
  let permissions: PermissionEnum[] = [];

  if (typeof permissionsValue === "string") {
    try {
      permissions = JSON.parse(permissionsValue);
    } catch (error) {
      console.error("Failed to parse permissions JSON:", error);
    }
  }

  const rawData = extractFormData(formData, permissions);

  const { data: dataForm, success, error } = schema.safeParse(rawData);

  const normalizedPermissions: PermissionEnum[] | undefined =
    permissions?.length
      ? (permissions.map((p) => p as PermissionEnum) as PermissionEnum[])
      : undefined;

  if (!success) {
    const response: ActionResponse<T> = {
      success: false,
      message: "Пожалуйста, исправьте ошибки в форме",
      errors: z.treeifyError(error),
      inputs: {
        ...rawData,
        permissions: normalizedPermissions,
      } as unknown as Partial<T>,
    };
    return response;
  }

  return {
    ...dataForm,
    department: dataForm.department as DepartmentEnum,
    role: dataForm.role as Role,
    permissions: dataForm.permissions as PermissionEnum[],
  };
};

const handleDirectorAssignment = async (
  departmentId: number,
  userId?: string
) => {
  const existingDirector = await prisma.department.findUnique({
    where: { id: departmentId },
    select: { directorId: true },
  });

  if (existingDirector?.directorId && existingDirector?.directorId !== userId) {
    throw new Error(
      `Ваш отдел уже имеет руководителя. Пожалуйста, обратитесь к администратору.`
    );
  }

  await prisma.department.update({
    where: { id: departmentId },
    data: { directorId: userId },
  });
};

const addUserToDb = async <T extends UserDataBase>(
  dataForm: T,
  hashedPassword: string,
  departmentId: number,
  action: string
) => {
  const selectFields = {
    id: true,
    username: true,
    email: true,
    role: true,
    departmentId: true,
    position: true,
    phone: true,
  };

  if (action === "create") {
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
      select: selectFields,
    });
  }
  if (action === "update") {
    return await prisma.user.update({
      where: { id: dataForm.id },
      data: {
        email: dataForm.email?.toLowerCase().trim(),
        phone: dataForm.phone?.toLowerCase().trim(),
        role: dataForm.role as Role,
        ...(departmentId && { departmentId }),
        username: dataForm.username?.toLowerCase().trim(),
        position: dataForm.position?.toLowerCase().trim(),
        ...(hashedPassword && { user_password: hashedPassword }),
      },
      select: selectFields,
    });
  }
  return undefined;
};

const assignPermissionsToUser = async (
  userId: string,
  permissions: PermissionEnum[]
) => {
  await prisma.userPermission.deleteMany({
    where: { userId: userId },
  });

  const permissionRecords = await prisma.permission.findMany({
    where: { name: { in: permissions } },
    select: { id: true, name: true },
  });

  const userPermissions = permissionRecords.map((permission) => ({
    userId: userId,
    permissionId: permission.id,
  }));

  if (userPermissions.length > 0) {
    await prisma.userPermission.createMany({
      data: userPermissions,
      skipDuplicates: true,
    });
  }
};

const checkUserPermissions = async (
  requiredPermissions: PermissionEnum[] = []
) => {
  const dataAuthUser = await handleAuthorization();
  if (dataAuthUser?.user && requiredPermissions.length > 0) {
    await checkUserPermissionByRole(dataAuthUser.user, requiredPermissions);
  }
};

const checkEmailUnique = async (email: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Пользователь с таким email уже существует");
  }
};

const hashUserPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password.trim(), 10);
};

const findDepartment = async (departmentName: string): Promise<Department> => {
  const department = await prisma.department.findUnique({
    where: { name: departmentName as DepartmentEnum },
  });

  if (!department) {
    throw new Error(`Департамент ${departmentName} не найден`);
  }

  return department;
};

function isUserFormData<T extends UserDataBase>(
  data: T | ActionResponse<T>
): data is T {
  return !("errors" in data);
}

export const createUser = async (
  formData: FormData
): Promise<ActionResponse<UserFormData>> => {
  try {
    const parsedData = safeParseFormData<UserFormData>(
      formData,
      userFormSchema
    );

    if (isUserFormData(parsedData)) {
      await checkUserPermissions([PermissionEnum.USER_MANAGEMENT]);
      await checkEmailUnique(parsedData.email as string);
      const hashedPassword = await hashUserPassword(parsedData.user_password!);
      const departmentTarget = await findDepartment(
        parsedData.department as string
      );

      if (parsedData.role === Role.DIRECTOR) {
        await handleDirectorAssignment(departmentTarget.id);
      }

      const newUser = await addUserToDb<UserFormData>(
        {
          ...parsedData,
          role: parsedData.role as Role,
          department: parsedData.department as DepartmentEnum,
        },
        hashedPassword,
        departmentTarget.id,
        "create"
      );
      if (!newUser) {
        throw new Error("Произошла ошибка при сохранении пользователя");
      }

      await assignPermissionsToUser(newUser.id, parsedData.permissions || []);
    } else {
      return parsedData;
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
): Promise<ActionResponse<UserFormEditData>> => {
  try {
    const parsedData = safeParseFormData<UserFormEditData>(
      formData,
      userFormEditSchema
    );

    if (isUserFormData(parsedData)) {
      await checkUserPermissions([PermissionEnum.USER_MANAGEMENT]);
      const currentUser = await prisma.user.findUnique({
        where: { id: parsedData.id! },
        select: { email: true },
      });

      if (!currentUser) {
        throw new Error("Пользователь не найден");
      }

      if (currentUser.email !== parsedData.email) {
        await checkEmailUnique(parsedData.email);
      }

      const hashedPassword = await hashUserPassword(parsedData.user_password!);
      const departmentTarget = await findDepartment(
        parsedData.department as string
      );

      if (parsedData.role === Role.DIRECTOR) {
        await handleDirectorAssignment(departmentTarget.id, parsedData.id);
      }

      const updatedUser = await addUserToDb<UserFormEditData>(
        {
          ...parsedData,
          role: parsedData.role as Role,
          department: parsedData.department as DepartmentEnum,
        },
        hashedPassword,
        departmentTarget.id,
        "update"
      );

      if (!updatedUser) {
        throw new Error("Произошла ошибка при сохранении изменений");
      }

      await assignPermissionsToUser(
        updatedUser.id,
        parsedData.permissions || []
      );
    } else {
      return parsedData;
    }

    return {
      success: true,
      message: "Пользователь изменен",
    };
  } catch (error) {
    console.log("Произошла ошибка при сохранении изменений", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Произошла ошибка при сохранении изменений",
    };
  }
};

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
              select: { name: true },
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

    const users = await prisma.user.findMany({
      where: { departmentId: Number(id) },
    });

    return users;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
