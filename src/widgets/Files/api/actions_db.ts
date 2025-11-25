"use server"

import { DealType, PermissionEnum } from "@prisma/client"
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { handleAuthorization } from "@/app/api/utils/handleAuthorization"
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import type { FileInfo } from "../types"

const checkingAccessRight = async (fileUserId: string, dealType: DealType, dealId: string) => {
  try {
    if (!fileUserId) {
      handleError("Недостаточно данных")
    }

    const { user, userId } = await handleAuthorization()

    const userOwnerProject = await prisma.user.findUnique({
      where: { id: fileUserId },
      select: { role: true, departmentId: true },
    })

    if (!userOwnerProject || !user) {
      return handleError("Пользователь не найден")
    }

    let isExistUserInManagersList: boolean = false

    if (dealType === DealType.PROJECT) {
      const managers = await prisma.projectManager.findMany({
        where: { dealId },
      })
      isExistUserInManagersList = managers.some((deal) => deal.userId === userId)
    }
    if (dealType === DealType.RETAIL) {
      const managers = await prisma.retailManager.findMany({
        where: { dealId },
      })
      isExistUserInManagersList = managers.some((deal) => deal.userId === userId)
    }
    const isOwner = fileUserId === user?.id

    if (!isOwner && !isExistUserInManagersList) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }
    return true
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getFileFromDB = async (fileInfo: Omit<FileInfo, "id" | "storageType">) => {
  try {
    return await prisma.dealFile.findFirst({
      where: {
        name: fileInfo.name,
        localPath: fileInfo.localPath,
        dealId: fileInfo.dealId,
        dealType: fileInfo.dealType,
        userId: fileInfo.userId,
      },
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const writeHrefDownloadFileInDB = async (data: {
  name: string
  localPath: string
  dealId: string
  dealType: DealType
  userId: string
}) => {
  try {
    const { name: fileName, localPath, dealId, dealType, userId } = data

    if (!fileName || !localPath || !dealId || !dealType || !userId) {
      throw new Error("Некоторые поля отсутствуют в formData")
    }

    await checkingAccessRight(userId as string, dealType, dealId)

    const fileInfo: Omit<FileInfo, "id" | "storageType"> = {
      name: fileName as string,
      localPath: localPath as string,
      dealId: dealId as string,
      dealType: dealType as DealType,
      userId: userId as string,
    }

    const isExistFile = await getFileFromDB(fileInfo)

    if (isExistFile) {
      return handleError("Файл с таким именем уже существует")
    }

    const file = await prisma.dealFile.create({
      data: {
        name: fileInfo.name,
        localPath: fileInfo.localPath,
        dealId: fileInfo.dealId,
        dealType: fileInfo.dealType,
        userId: fileInfo.userId,
      },
    })

    return file
  } catch (error) {
    console.error(error)
    return handleError("Ошибка при записи файла в базу данных")
  }
}

export const deleteFileFromDB = async (
  fileInfo: Pick<FileInfo, "id" | "dealType" | "userId" | "dealId">,
) => {
  try {
    const { id, userId, dealType, dealId } = fileInfo
    await checkingAccessRight(userId, dealType, dealId)

    const isExistFile = await prisma.dealFile.findUnique({
      where: {
        id,
        dealType,
      },
    })

    if (!isExistFile) {
      return handleError("Файл не найден")
    }

    const deletedFile = await prisma.dealFile.delete({
      where: {
        id: isExistFile.id,
        dealType: isExistFile.dealType,
      },
    })

    return deletedFile
  } catch (error) {
    console.error(error)
    return handleError("Ошибка при удалении данных из базы")
  }
}

export const getAllFilesDealFromDb = async (userId: string, dealId: string, dealType: DealType) => {
  try {
    await checkingAccessRight(userId, dealType, dealId)

    const files = await prisma.dealFile.findMany({
      where: {
        dealId,
        dealType,
        userId,
      },
    })

    return files
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
